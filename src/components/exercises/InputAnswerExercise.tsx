"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function InputAnswerExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>{(setAnswer, _selectedAnswer, locked) => <input disabled={locked} className="mx-auto block w-full max-w-3xl rounded-2xl border border-slate-300 p-3 text-center text-lg font-bold disabled:bg-slate-50 md:p-4" placeholder="Digite sua resposta" onChange={(event) => setAnswer(event.target.value)} />}</ExerciseSubmitter>;
}
