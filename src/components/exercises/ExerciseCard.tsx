"use client";

import type { Exercise } from "@/types/exercise";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { InputAnswerExercise } from "@/components/exercises/InputAnswerExercise";
import { TrueFalseExercise } from "@/components/exercises/TrueFalseExercise";
import { CompleteExercise } from "@/components/exercises/CompleteExercise";
import { WordProblemExercise } from "@/components/exercises/WordProblemExercise";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";

type ExerciseCardProps = {
  exercise: Exercise;
  onAnswered?: (result: AttemptResult) => void;
  onContinue?: () => void;
  isLast?: boolean;
};

export function ExerciseCard({ exercise, onAnswered, onContinue, isLast }: ExerciseCardProps) {
  const props = { exercise, onAnswered, onContinue, isLast };
  if (exercise.type === "multiple_choice") return <MultipleChoiceExercise {...props} />;
  if (exercise.type === "true_false") return <TrueFalseExercise {...props} />;
  if (exercise.type === "complete") return <CompleteExercise {...props} />;
  if (exercise.type === "word_problem") return <WordProblemExercise {...props} />;
  return <InputAnswerExercise {...props} />;
}
