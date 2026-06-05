"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ChevronRight, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/types/exercise";

export type AttemptResult = {
  isCorrect: boolean;
  feedback: string;
  xpEarned?: number;
  explanation?: string | null;
};

type ExerciseSubmitterProps = {
  exercise: Exercise;
  children: (setAnswer: (value: string) => void, selectedAnswer: string, locked: boolean) => React.ReactNode;
  onAnswered?: (result: AttemptResult) => void;
  onContinue?: () => void;
  isLast?: boolean;
};

export function ExerciseSubmitter({ exercise, children, onAnswered, onContinue, isLast = false }: ExerciseSubmitterProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (result) return;
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, answer, usedHint: false, timeSpentSeconds: 30 }),
        });
        const payload = await response.json();
        const nextResult = response.ok ? payload : { isCorrect: false, feedback: payload.error ?? "Não foi possível registrar sua resposta agora." };
        setResult(nextResult);
        onAnswered?.(nextResult);
      } catch {
        const nextResult = { isCorrect: false, feedback: "Não foi possível registrar sua resposta agora. Tente novamente." };
        setResult(nextResult);
        onAnswered?.(nextResult);
      }
    });
  }

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white px-4 py-4 text-center shadow-[0_30px_90px_rgba(76,51,162,0.12)] ring-1 ring-slate-100 sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute right-6 top-6 hidden h-9 w-9 sm:block">
        <Sparkles className="h-full w-full text-[#66d6a6]" />
      </div>
      <div className="pointer-events-none absolute left-6 top-[46%] hidden h-7 w-7 sm:block">
        <Sparkles className="h-full w-full text-[#f7c44d]" />
      </div>
      <div className="pointer-events-none absolute right-8 top-[56%] hidden h-6 w-6 sm:block">
        <Sparkles className="h-full w-full text-[#7fc8ff]" />
      </div>

      <div className="relative z-10 grid gap-4 sm:gap-6">
        <div className="mx-auto inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 shadow-sm sm:px-5 sm:text-base">
          <Sparkles size={16} className="mr-2 sm:size-[18px]" />
          Dificuldade {exercise.difficulty}
        </div>

        <div className="px-1 text-center sm:px-4">
          <h2 className="text-[clamp(1.25rem,7vw,2.5rem)] font-black leading-[0.95] tracking-tight text-[#0f1740] sm:text-[clamp(1.8rem,4vw,3rem)]">
            {exercise.question}
          </h2>
        </div>

        <div className="mx-auto w-full max-w-3xl">{children(setAnswer, answer, Boolean(result))}</div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {!result ? (
            <Button
              className="min-h-14 w-full rounded-[26px] px-5 text-xl font-black sm:min-h-16 sm:rounded-[28px] sm:px-6 sm:text-2xl"
              disabled={isPending || !answer}
              onClick={submit}
              variant="purple"
            >
              {isPending ? "Enviando..." : "Responder"}
            </Button>
          ) : null}

        </div>

      </div>

      {result ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#eef2ff]/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 text-center shadow-[0_30px_90px_rgba(76,51,162,0.18)] ring-1 ring-slate-200">
            <div
              className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl font-black ${
                result.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {result.isCorrect ? <CheckCircle2 size={34} /> : <ChevronRight size={34} className="rotate-180" />}
            </div>
            <h3 className="mt-4 text-2xl font-black text-slate-950">{result.isCorrect ? "Muito bem!" : "Quase lá!"}</h3>
            <p
              className={`mt-4 rounded-[22px] p-4 text-center text-base font-semibold leading-7 ${
                result.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              }`}
            >
              {result.feedback}
            </p>
            {result.explanation ? <p className="mt-3 text-center text-sm leading-6 text-slate-600">{result.explanation}</p> : null}
            <Button className="mt-6 w-full rounded-full px-6 py-4 text-lg font-black" onClick={onContinue} variant="purple">
              {isLast ? (
                <>
                  <Trophy size={18} />
                  Ver resultado
                </>
              ) : (
                "Próximo"
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
