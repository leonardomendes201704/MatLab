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
