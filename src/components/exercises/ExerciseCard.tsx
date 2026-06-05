"use client";

import type { Exercise } from "@/types/exercise";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { InputAnswerExercise } from "@/components/exercises/InputAnswerExercise";
import { TrueFalseExercise } from "@/components/exercises/TrueFalseExercise";
import { CompleteExercise } from "@/components/exercises/CompleteExercise";
import { WordProblemExercise } from "@/components/exercises/WordProblemExercise";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  if (exercise.type === "multiple_choice") return <MultipleChoiceExercise exercise={exercise} />;
  if (exercise.type === "true_false") return <TrueFalseExercise exercise={exercise} />;
  if (exercise.type === "complete") return <CompleteExercise exercise={exercise} />;
  if (exercise.type === "word_problem") return <WordProblemExercise exercise={exercise} />;
  return <InputAnswerExercise exercise={exercise} />;
}
