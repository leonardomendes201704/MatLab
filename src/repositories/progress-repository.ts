import { createServiceClient } from "@/lib/supabase/server";
import { todayIsoDate } from "@/utils/date";

export async function recordAttempt(input: {
  userId: string;
  exerciseId: string;
  lessonId: string;
  answer: string;
  isCorrect: boolean;
  usedHint: boolean;
  attemptNumber: number;
  xpEarned: number;
  timeSpentSeconds: number;
}) {
  const supabase = createServiceClient();
  if (!supabase) return { id: "demo-attempt", ...input };

  const { data, error } = await supabase.from("attempts").insert({
    user_id: input.userId,
    exercise_id: input.exerciseId,
    lesson_id: input.lessonId,
    answer: input.answer,
    is_correct: input.isCorrect,
    used_hint: input.usedHint,
    attempt_number: input.attemptNumber,
    xp_earned: input.xpEarned,
    time_spent_seconds: input.timeSpentSeconds,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function countAttemptsForExercise(userId: string, exerciseId: string) {
  const supabase = createServiceClient();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId);

  return count ?? 0;
}

export async function applyProgress(input: {
  userId: string;
  lessonId: string;
  exerciseId: string;
  skillId?: string | null;
  isCorrect: boolean;
  xpEarned: number;
  timeSpentSeconds: number;
}) {
  const supabase = createServiceClient();
  if (!supabase) return;

  const date = todayIsoDate();
  await supabase.rpc("increment_learning_progress", {
    p_user_id: input.userId,
    p_lesson_id: input.lessonId,
    p_exercise_id: input.exerciseId,
    p_skill_id: input.skillId,
    p_is_correct: input.isCorrect,
    p_xp_earned: input.xpEarned,
    p_time_spent_seconds: input.timeSpentSeconds,
    p_activity_date: date,
  });
}
