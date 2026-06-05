"use client";

import { ExerciseSubmitter } from "@/components/exercises/ExerciseSubmitter";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import type { Exercise } from "@/types/exercise";

export function MultipleChoiceExercise({ exercise, onAnswered, onContinue, isLast }: { exercise: Exercise; onAnswered?: (result: AttemptResult) => void; onContinue?: () => void; isLast?: boolean }) {
  return (
    <ExerciseSubmitter exercise={exercise} onAnswered={onAnswered} onContinue={onContinue} isLast={isLast}>
      {(setAnswer, selectedAnswer, locked) => (
        <div className="mx-auto grid w-full gap-3">
          {exercise.exercise_options?.map((option) => {
            const isSelected = selectedAnswer === option.option_text;
            return (
              <button
                className={`min-h-16 rounded-[24px] border-2 px-5 py-4 text-center text-lg font-bold transition ${
                  isSelected
                    ? "border-[#8d5afc] bg-[#f4f0ff] text-[#4125b4] shadow-[0_10px_24px_rgba(111,73,246,0.12)]"
                    : "border-slate-200 bg-white text-slate-800 hover:border-[#c9bcff] hover:bg-[#faf8ff]"
                } disabled:cursor-default disabled:opacity-70`}
                disabled={locked}
                key={option.id}
                onClick={() => setAnswer(option.option_text)}
                type="button"
              >
                {option.option_text}
              </button>
            );
          })}
        </div>
      )}
    </ExerciseSubmitter>
  );
}
