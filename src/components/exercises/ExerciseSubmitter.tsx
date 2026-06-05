"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { CheckCircle2, ChevronRight, Lightbulb, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/types/exercise";
import mascotImage from "../../images/Mascote principal do wizard.png";

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
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (result) return;
    startTransition(async () => {
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exerciseId: exercise.id, answer, usedHint: showHint, timeSpentSeconds: 30 }),
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
    <div className="relative overflow-hidden rounded-[36px] border border-slate-100 bg-white px-5 py-6 text-center shadow-[0_30px_90px_rgba(76,51,162,0.12)] ring-1 ring-slate-100 sm:px-7 sm:py-8">
      <div className="pointer-events-none absolute right-8 top-8 hidden h-9 w-9 sm:block">
        <Sparkles className="h-full w-full text-[#66d6a6]" />
      </div>
      <div className="pointer-events-none absolute left-8 top-[46%] hidden h-7 w-7 sm:block">
        <Sparkles className="h-full w-full text-[#f7c44d]" />
      </div>
      <div className="pointer-events-none absolute right-10 top-[56%] hidden h-6 w-6 sm:block">
        <Sparkles className="h-full w-full text-[#7fc8ff]" />
      </div>

      <div className="relative z-10 grid gap-6">
        <div className="grid items-center gap-4 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-6">
          <div className="mx-auto flex w-full max-w-[180px] justify-center">
            <Image
              alt="Mascote do wizard"
              className="h-auto w-full drop-shadow-[0_22px_45px_rgba(84,42,175,0.20)]"
              height={1436}
              preload
              src={mascotImage}
              width={1436}
            />
          </div>

          <div className="relative">
            <div className="relative rounded-[30px] bg-[#f4f1ff] px-5 py-5 text-left shadow-[0_12px_30px_rgba(97,68,190,0.08)] sm:px-6 sm:py-6">
              <div className="absolute left-0 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[6px] bg-[#f4f1ff]" />
              <p className="max-w-2xl text-[clamp(1.05rem,2vw,1.35rem)] leading-relaxed text-slate-800">
                Foco total! Cada acerto te deixa mais próximo do topo! <span className="align-middle">🚀</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto inline-flex items-center rounded-full bg-emerald-50 px-5 py-2 text-base font-black text-emerald-700 shadow-sm">
          <Sparkles size={18} className="mr-2" />
          Dificuldade {exercise.difficulty}
        </div>

        <div className="px-2 text-center sm:px-4">
          <h2 className="text-[clamp(2.7rem,6.5vw,4.7rem)] font-black leading-none tracking-tight text-[#0f1740] sm:text-[clamp(3rem,6vw,5.25rem)]">
            {exercise.question}
          </h2>
        </div>

        <div className="mx-auto w-full max-w-3xl">{children(setAnswer, answer, Boolean(result))}</div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {!result ? (
            <Button
              className="min-h-16 w-full rounded-[28px] px-6 text-2xl font-black"
              disabled={isPending || !answer}
              onClick={submit}
              variant="purple"
            >
              {isPending ? "Enviando..." : "Responder"}
            </Button>
          ) : null}

          {exercise.hint ? (
            <Button
              className="mx-auto min-h-14 rounded-full px-8 text-lg text-[#6d39f2] ring-1 ring-[#a88cff] hover:bg-[#f5f0ff]"
              onClick={() => setShowHint((value) => !value)}
              type="button"
              variant="secondary"
            >
              <Lightbulb size={20} />
              {showHint ? "Ocultar dica" : "Ver dica"}
            </Button>
          ) : null}
        </div>

        {showHint && exercise.hint ? (
          <div className="mx-auto w-full max-w-3xl rounded-[24px] bg-amber-50 px-4 py-4 text-left text-base font-medium leading-7 text-amber-900 ring-1 ring-amber-100">
            {exercise.hint}
          </div>
        ) : null}

        <div className="flex items-center justify-center gap-4 text-[clamp(1rem,1.7vw,1.2rem)] text-slate-700">
          <Sparkles className="text-[#56d69e]" size={18} />
          <span className="inline-flex items-center gap-2 font-medium">
            <HeartIcon />
            Você consegue!
          </span>
          <Sparkles className="text-[#56d69e]" size={18} />
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
            <p className={`mt-4 rounded-[22px] p-4 text-center text-base font-semibold leading-7 ${result.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
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

function HeartIcon() {
  return <span className="text-xl text-[#8f54ff]">♥</span>;
}
