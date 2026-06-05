"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function InputAnswerExercise({ exercise }: { exercise: Exercise }) {
  return <ExerciseSubmitter exercise={exercise}>{(setAnswer) => <input className="w-full rounded-2xl border border-slate-300 p-4 text-lg font-bold" placeholder="Digite sua resposta" onChange={(event) => setAnswer(event.target.value)} />}</ExerciseSubmitter>;
}
