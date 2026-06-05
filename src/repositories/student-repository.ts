import { demoProgress } from "@/lib/data/catalog";
import { createServiceClient } from "@/lib/supabase/server";
import type { StudentProgress } from "@/types/progress";

export async function getStudentProgress(userId?: string): Promise<StudentProgress> {
  const supabase = createServiceClient();
  if (!supabase || !userId) return demoProgress;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  const { data: daily } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { count: attempts } = await supabase.from("attempts").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: correct } = await supabase.from("attempts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("is_correct", true);
  const { data: weak } = await supabase
    .from("skill_stats")
    .select("skills(name)")
    .eq("user_id", userId)
    .eq("needs_review", true)
    .limit(5);

  const accuracy = attempts ? Math.round(((correct ?? 0) / attempts) * 100) : 0;

  type WeakSkillRow = { skills?: { name?: string } | { name?: string }[] | null };
  return {
    totalXp: profile?.total_xp ?? 0,
    currentStreak: profile?.current_streak ?? 0,
    bestStreak: profile?.best_streak ?? 0,
    dailyGoal: profile?.daily_goal ?? 10,
    todayDone: daily?.exercises_done ?? 0,
    exercisesDone: attempts ?? 0,
    accuracy,
    completedLessons: 0,
    completedModules: 0,
    weakSkills: ((weak ?? []) as WeakSkillRow[]).map((item) => Array.isArray(item.skills) ? item.skills[0]?.name : item.skills?.name).filter((name): name is string => Boolean(name)),
  };
}

export type ResumableLesson = {
  href: string;
  title: string;
  totalAttempts: number;
};

export type LessonProgressState = {
  completed: boolean;
  totalAttempts: number;
};

export async function archiveLessonProgress(userId: string, lessonId: string) {
  const supabase = createServiceClient();
  if (!supabase || !userId) return;

  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("user_id,lesson_id,score,correct_count,wrong_count,total_attempts,xp_earned,started_at,completed_at")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (!lessonProgress) return;

  const startedAt = lessonProgress.started_at ? new Date(lessonProgress.started_at) : null;
  const completedAt = lessonProgress.completed_at ? new Date(lessonProgress.completed_at) : new Date();
  const durationSeconds = startedAt ? Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 1000)) : 0;

  const { error: historyError } = await supabase.from("lesson_progress_history").insert({
    user_id: lessonProgress.user_id,
    lesson_id: lessonProgress.lesson_id,
    score: lessonProgress.score ?? 0,
    correct_count: lessonProgress.correct_count ?? 0,
    wrong_count: lessonProgress.wrong_count ?? 0,
    total_attempts: lessonProgress.total_attempts ?? 0,
    xp_earned: lessonProgress.xp_earned ?? 0,
    started_at: lessonProgress.started_at ?? new Date().toISOString(),
    completed_at: completedAt.toISOString(),
    duration_seconds: durationSeconds,
    archived_at: new Date().toISOString(),
  });

  if (historyError) throw historyError;

  const { error: deleteError } = await supabase.from("lesson_progress").delete().eq("user_id", userId).eq("lesson_id", lessonId);
  if (deleteError) throw deleteError;
}

export async function getResumableLesson(userId?: string): Promise<ResumableLesson | null> {
  const supabase = createServiceClient();
  if (!supabase || !userId) return null;

  const { data: lessonProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id,total_attempts")
    .eq("user_id", userId)
    .eq("completed", false)
    .gt("total_attempts", 0)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lessonProgress?.lesson_id) return null;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id,title,order_index,module_id")
    .eq("id", lessonProgress.lesson_id)
    .maybeSingle();

  if (!lesson?.id || !lesson.module_id) return null;

  const { data: module } = await supabase
    .from("modules")
    .select("order_index")
    .eq("id", lesson.module_id)
    .maybeSingle();

  if (module?.order_index == null) return null;

  const lessonSlug = `licao-${module.order_index}-${lesson.order_index}`;
  const start = Math.max(0, lessonProgress.total_attempts ?? 0);
  return {
    href: `/app/licao/${lessonSlug}?start=${start}`,
    title: lesson.title,
    totalAttempts: start,
  };
}

export async function getLessonProgressState(userId: string, lessonId: string): Promise<LessonProgressState | null> {
  const supabase = createServiceClient();
  if (!supabase || !userId) return null;

  const { data } = await supabase
    .from("lesson_progress")
    .select("completed,total_attempts")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (!data) return null;

  return {
    completed: Boolean(data.completed),
    totalAttempts: Math.max(0, data.total_attempts ?? 0),
  };
}

export async function resetLessonProgress(userId: string, lessonId: string) {
  const supabase = createServiceClient();
  if (!supabase || !userId) return;

  await supabase
    .from("lesson_progress")
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: false,
      score: 0,
      correct_count: 0,
      wrong_count: 0,
      total_attempts: 0,
      xp_earned: 0,
      started_at: new Date().toISOString(),
      completed_at: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" })
    .select();
}

export async function listStudents() {
  const supabase = createServiceClient();
  if (!supabase) {
    return [
      { id: "demo-aluno-1", name: "Ana Silva", email: "ana@example.com", total_xp: 240, current_streak: 4, is_active: true },
      { id: "demo-aluno-2", name: "João Santos", email: "joao@example.com", total_xp: 120, current_streak: 2, is_active: true },
    ];
  }

  const { data } = await supabase
    .from("profiles")
    .select("id,name,nickname,total_xp,current_streak,best_streak,is_active,created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return data ?? [];
}
