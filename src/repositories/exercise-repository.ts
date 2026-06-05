import { demoExercises } from "@/lib/data/catalog";
import { createServiceClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const supabase = createServiceClient();
  if (!supabase) return demoExercises.find((exercise) => exercise.id === id) ?? null;

  const { data } = await supabase
    .from("exercises")
    .select("*, exercise_options(*)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  return data as Exercise | null;
}

export async function listExercises() {
  const supabase = createServiceClient();
  if (!supabase) return demoExercises;

  const { data } = await supabase
    .from("exercises")
    .select("*, exercise_options(*)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (data ?? []) as Exercise[];
}

export async function upsertExercise(input: Record<string, unknown>, id?: string) {
  const supabase = createServiceClient();
  if (!supabase) return { id: id ?? "demo-created", ...input };

  if (id) {
    const { data, error } = await supabase.from("exercises").update(input).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase.from("exercises").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function deactivateExercise(id: string) {
  const supabase = createServiceClient();
  if (!supabase) return { id, is_active: false };

  const { data, error } = await supabase
    .from("exercises")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
