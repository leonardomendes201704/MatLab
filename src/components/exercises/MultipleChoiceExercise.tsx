"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function MultipleChoiceExercise({ exercise }: { exercise: Exercise }) {
  return (
    <ExerciseSubmitter exercise={exercise}>
      {(setAnswer) => <div className="grid gap-3">{exercise.exercise_options?.map((option) => <button className="rounded-2xl border border-slate-200 p-4 text-left font-bold hover:border-emerald-400 hover:bg-emerald-50" key={option.id} onClick={() => setAnswer(option.option_text)}>{option.option_text}</button>)}</div>}
    </ExerciseSubmitter>
  );
}
