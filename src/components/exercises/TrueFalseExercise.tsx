"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function TrueFalseExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return (
    <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>
      {(setAnswer, selectedAnswer, locked) => (
        <div className="mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            className={`min-h-16 rounded-[24px] border-2 px-5 py-4 text-center text-lg font-black transition ${
              selectedAnswer === "true"
                ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-[0_10px_24px_rgba(16,185,129,0.12)]"
                : "border-slate-200 bg-white text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
            } disabled:cursor-default disabled:opacity-70`}
            disabled={locked}
            onClick={() => setAnswer("true")}
            type="button"
          >
            Verdadeiro
          </button>
          <button
            className={`min-h-16 rounded-[24px] border-2 px-5 py-4 text-center text-lg font-black transition ${
              selectedAnswer === "false"
                ? "border-rose-500 bg-rose-50 text-rose-800 shadow-[0_10px_24px_rgba(244,63,94,0.12)]"
                : "border-slate-200 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50"
            } disabled:cursor-default disabled:opacity-70`}
            disabled={locked}
            onClick={() => setAnswer("false")}
            type="button"
          >
            Falso
          </button>
        </div>
      )}
    </ExerciseSubmitter>
  );
}
