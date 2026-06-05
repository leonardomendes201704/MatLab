"use server";

import { exerciseSchema } from "@/lib/validations/exercise";
import { upsertExercise } from "@/repositories/exercise-repository";

export async function saveExerciseAction(_prevState: unknown, formData: FormData) {
  const parsed = exerciseSchema.safeParse({
    lesson_id: formData.get("lesson_id"),
    type: formData.get("type"),
    question: formData.get("question"),
    correct_answer: formData.get("correct_answer"),
    hint: formData.get("hint"),
    explanation: formData.get("explanation"),
    difficulty: 1,
    school_year: 7,
    tags: [],
    order_index: 0,
    is_active: true,
    options: [],
  });

  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  const { options, ...exercise } = parsed.data;
  void options;
  await upsertExercise(exercise);
  return { ok: true, message: "Exercício salvo." };
}
