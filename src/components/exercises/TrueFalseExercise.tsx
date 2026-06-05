"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function TrueFalseExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseSubmitter exercise={exercise}>{(setAnswer) => <div className="grid grid-cols-2 gap-3"><button className="rounded-2xl bg-emerald-100 p-4 font-black text-emerald-800" onClick={() => setAnswer("true")}>Verdadeiro</button><button className="rounded-2xl bg-rose-100 p-4 font-black text-rose-800" onClick={() => setAnswer("false")}>Falso</button></div>}</ExerciseSubmitter>;
}
