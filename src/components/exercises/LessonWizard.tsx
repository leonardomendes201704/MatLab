"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Exercise } from "@/types/exercise";

type LessonWizardProps = {
  lesson: {
    title: string;
    explanation?: string | null;
    example?: string | null;
  };
  exercises: Exercise[];
};

export function LessonWizard({ lesson, exercises }: LessonWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useResults();
  const currentExercise = exercises[currentIndex];
  const isDone = currentIndex >= exercises.length;
  const correctCount = results.filter((result) => result.isCorrect).length;
  const totalXp = results.reduce((sum, result) => sum + (result.xpEarned ?? 0), 0);

  function handleAnswered(result: AttemptResult) {
    setResults((previous) => [...previous, result]);
  }

  function handleContinue() {
    setCurrentIndex((index) => Math.min(index + 1, exercises.length));
  }

  if (!exercises.length) {
    return (
      <div className="grid h-[calc(100dvh-168px)] place-items-center overflow-hidden md:h-[calc(100dvh-104px)]">
        <div className="max-w-md rounded-2xl bg-white p-6 text-center ring-1 ring-slate-200">
          <h1 className="text-2xl font-black">Sem exercícios por enquanto</h1>
          <p className="mt-2 text-slate-600">Esta lição ainda não tem exercícios ativos no Supabase.</p>
        </div>
      </div>
    );
  }

  if (isDone) {
    const accuracy = Math.round((correctCount / Math.max(exercises.length, 1)) * 100);
    return (
      <div className="grid h-[calc(100dvh-168px)] place-items-center overflow-hidden md:h-[calc(100dvh-104px)]">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 text-center ring-1 ring-slate-200 md:p-10">
          <Trophy className="mx-auto text-amber-500" size={56} />
          <h1 className="mt-4 text-3xl font-black text-slate-950">Lição concluída</h1>
          <p className="mt-2 text-slate-600">Você respondeu {exercises.length} exercícios, acertou {correctCount} e ganhou {totalXp} XP.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Acertos" value={correctCount} />
            <Stat label="Taxa" value={`${accuracy}%`} />
            <Stat label="XP" value={totalXp} />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/app"><Button>Voltar ao início</Button></Link>
            <Link href="/app/trilha"><Button variant="secondary">Ver trilha</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100dvh-168px)] grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden md:h-[calc(100dvh-104px)] md:gap-4">
      <header className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 md:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase text-emerald-700">Lição</p>
            <h1 className="truncate text-base font-black text-slate-950 md:text-xl">{lesson.title}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">
            <CheckCircle2 size={16} />
            {currentIndex + 1}/{exercises.length}
          </div>
        </div>
        <div className="mt-2 md:mt-3">
          <ProgressBar value={(currentIndex / exercises.length) * 100} />
        </div>
      </header>

      <section className="min-h-0 overflow-hidden">
        <ExerciseCard
          key={currentExercise.id}
          exercise={currentExercise}
          isLast={currentIndex === exercises.length - 1}
          onAnswered={handleAnswered}
          onContinue={handleContinue}
        />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function useResults() {
  return useState<AttemptResult[]>([]);
}
