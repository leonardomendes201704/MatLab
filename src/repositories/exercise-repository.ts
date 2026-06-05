import { demoExercises } from "@/lib/data/catalog";
import { createServiceClient } from "@/lib/supabase/server";
import type { Exercise } from "@/types/exercise";

const lessonSlugPattern = /^licao-(\d+)-(\d+)$/;

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

export async function listExercisesByLessonSlug(lessonSlug: string): Promise<Exercise[]> {
  const supabase = createServiceClient();
  if (!supabase) return demoExercises.filter((exercise) => exercise.lesson_id === lessonSlug);

  const match = lessonSlug.match(lessonSlugPattern);
  if (!match) return [];

  const moduleOrder = Number(match[1]);
  const lessonOrder = Number(match[2]);

  const { data: currentLesson } = await supabase
    .from("lessons")
    .select("id, modules!inner(order_index)")
    .eq("order_index", lessonOrder)
    .eq("modules.order_index", moduleOrder)
    .eq("is_active", true)
    .maybeSingle();

  if (!currentLesson?.id) return [];

  const { data } = await supabase
    .from("exercises")
    .select("*, exercise_options(*)")
    .eq("lesson_id", currentLesson.id)
    .eq("is_active", true)
    .order("order_index")
    .limit(20);

  return (data ?? []) as Exercise[];
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
