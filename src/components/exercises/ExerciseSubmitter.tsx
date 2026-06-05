"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/types/exercise";

type AttemptResult = {
  isCorrect: boolean;
  feedback: string;
  explanation?: string | null;
};

export function ExerciseSubmitter({ exercise, children }: { exercise: Exercise; children: (setAnswer: (value: string) => void) => React.ReactNode }) {
  const [answer, setAnswer] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, answer, usedHint, timeSpentSeconds: 30 }),
        });
        const payload = await response.json();
        setResult(response.ok ? payload : { isCorrect: false, feedback: payload.error ?? "Não foi possível registrar sua resposta agora." });
      } catch {
        setResult({ isCorrect: false, feedback: "Não foi possível registrar sua resposta agora. Tente novamente." });
      }
    });
  }

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <p className="text-xs font-black uppercase text-emerald-700">Dificuldade {exercise.difficulty}</p>
      <h2 className="mt-2 text-xl font-black text-slate-950">{exercise.question}</h2>
      <div className="mt-5">{children(setAnswer)}</div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={submit} disabled={isPending || !answer}>{isPending ? "Enviando..." : "Responder"}</Button>
        <Button type="button" variant="secondary" onClick={() => setUsedHint(true)}>Ver dica</Button>
      </div>
      {usedHint ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{exercise.hint}</p> : null}
      {result ? <p className={`mt-4 rounded-xl p-4 font-bold ${result.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{result.feedback}</p> : null}
      {result?.explanation ? <p className="mt-3 text-sm text-slate-600">{result.explanation}</p> : null}
    </div>
  );
}
