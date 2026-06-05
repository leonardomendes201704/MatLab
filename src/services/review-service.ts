import { demoExercises } from "@/lib/data/catalog";
import { createServiceClient } from "@/lib/supabase/server";

export async function getReviewExercises(userId?: string) {
  const supabase = createServiceClient();
  if (!supabase || !userId) return demoExercises;

  const { data: weakStats } = await supabase
    .from("skill_stats")
    .select("skill_id")
    .eq("user_id", userId)
    .eq("needs_review", true)
    .order("mastery_level", { ascending: true })
    .limit(8);

  const skillIds = (weakStats ?? []).map((item) => item.skill_id).filter(Boolean);
  if (!skillIds.length) return [];

  const { data } = await supabase
    .from("exercises")
    .select("*, exercise_options(*)")
    .in("skill_id", skillIds)
    .eq("is_active", true)
    .limit(20);

  return data ?? [];
}
