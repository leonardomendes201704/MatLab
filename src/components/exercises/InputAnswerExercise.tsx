"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function InputAnswerExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return (
    <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>
      {(setAnswer, _selectedAnswer, locked) => (
        <div className="mx-auto w-full">
          <input
            aria-label="Digite sua resposta"
            className="h-20 w-full rounded-[28px] border-2 border-[#c9bcff] bg-white px-6 text-center text-[clamp(1.15rem,2vw,1.5rem)] font-bold text-slate-900 shadow-[0_10px_30px_rgba(76,51,162,0.06)] outline-none transition placeholder:text-slate-400 focus:border-[#8d5afc] focus:ring-4 focus:ring-[#e8e0ff] disabled:bg-slate-50"
            disabled={locked}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Digite sua resposta"
          />
        </div>
      )}
    </ExerciseSubmitter>
  );
}
