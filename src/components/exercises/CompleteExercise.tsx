"use client";

import { InputAnswerExercise } from "@/components/exercises/InputAnswerExercise";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function CompleteExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return <InputAnswerExercise exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast} />;
}
