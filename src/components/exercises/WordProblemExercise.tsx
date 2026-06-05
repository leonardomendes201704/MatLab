"use client";

import { InputAnswerExercise } from "@/components/exercises/InputAnswerExercise";
import type { Exercise } from "@/types/exercise";

export function WordProblemExercise({ exercise }: { exercise: Exercise }) {
  return <InputAnswerExercise exercise={exercise} />;
}
