"use client";

import { useState, useTransition } from "react";
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
  const [usedHint] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (result) return;
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, answer, usedHint, timeSpentSeconds: 30 }),
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
    <div className="grid h-full content-center rounded-2xl bg-white p-5 ring-1 ring-slate-200 md:p-8">
      <p className="text-xs font-black uppercase text-emerald-700">Dificuldade {exercise.difficulty}</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-4xl">{exercise.question}</h2>
      <div className="mt-6">{children(setAnswer, answer, Boolean(result))}</div>
      <div className="mt-5 flex flex-wrap gap-3">
        {!result ? <Button onClick={submit} disabled={isPending || !answer}>{isPending ? "Enviando..." : "Responder"}</Button> : null}
      </div>
      {usedHint ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{exercise.hint}</p> : null}
      {result ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-slate-200">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-3xl font-black ${result.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              {result.isCorrect ? "✓" : "!"}
            </div>
            <h3 className="mt-4 text-2xl font-black text-slate-950">
              {result.isCorrect ? "Muito bem!" : "Quase lá!"}
            </h3>
            <p className={`mt-3 rounded-xl p-4 text-center font-bold ${result.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
              {result.feedback}
            </p>
            {result.explanation ? <p className="mt-3 text-center text-sm text-slate-600">{result.explanation}</p> : null}
            <Button className="mt-6 w-full" onClick={onContinue}>
              {isLast ? "Ver resultado" : "Próximo"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
