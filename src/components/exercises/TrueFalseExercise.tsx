"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function TrueFalseExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>{(setAnswer, selectedAnswer, locked) => <div className="grid grid-cols-2 gap-3"><button disabled={locked} className={`rounded-2xl p-4 font-black text-emerald-800 ${selectedAnswer === "true" ? "bg-emerald-200" : "bg-emerald-100"}`} onClick={() => setAnswer("true")}>Verdadeiro</button><button disabled={locked} className={`rounded-2xl p-4 font-black text-rose-800 ${selectedAnswer === "false" ? "bg-rose-200" : "bg-rose-100"}`} onClick={() => setAnswer("false")}>Falso</button></div>}</ExerciseSubmitter>;
}
