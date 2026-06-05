"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function MultipleChoiceExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return (
    <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>
      {(setAnswer, selectedAnswer, locked) => <div className="grid gap-3">{exercise.exercise_options?.map((option) => <button disabled={locked} className={`rounded-2xl border p-4 text-left font-bold transition ${selectedAnswer === option.option_text ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50"} disabled:cursor-default`} key={option.id} onClick={() => setAnswer(option.option_text)}>{option.option_text}</button>)}</div>}
    </ExerciseSubmitter>
  );
}
