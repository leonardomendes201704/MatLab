"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2, ChevronLeft, Crown, Home, Map, Trophy, UserRound } from "lucide-react";
import avatarTopImage from "../../images/Avatar do topo.png";
import decorativeSpritesImage from "../../images/Pequenos elementos decorativos.png";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import type { AttemptResult } from "@/components/exercises/ExerciseSubmitter";
import { Button } from "@/components/ui/Button";
import type { Exercise } from "@/types/exercise";

type LessonWizardProps = {
  lessonId: string;
  lesson: {
    title: string;
    explanation?: string | null;
    example?: string | null;
  };
  exercises: Exercise[];
  initialIndex?: number;
};

const bottomNavItems = [
  { href: "/app", label: "Início", icon: Home, active: true },
  { href: "/app/trilha", label: "Trilha", icon: Map, active: false },
  { href: "/app/revisao", label: "Revisão", icon: BookOpen, active: false },
  { href: "/app/perfil", label: "Perfil", icon: UserRound, active: false },
];

export function LessonWizard({ lessonId, lesson, exercises, initialIndex = 0 }: LessonWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(exercises.length - 1, 0)));
  const [results, setResults] = useResults();
  const initializedRef = useRef(false);
  const currentExercise = exercises[currentIndex];
  const isDone = currentIndex >= exercises.length;
  const correctCount = results.filter((result) => result.isCorrect).length;
  const totalXp = results.reduce((sum, result) => sum + (result.xpEarned ?? 0), 0);
  const currentProgress = Math.min(currentIndex + 1, exercises.length);

  useEffect(() => {
    if (initializedRef.current || initialIndex > 0) return;
    initializedRef.current = true;
    void fetch("/api/lesson-progress/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, exerciseCount: exercises.length }),
    }).catch(() => undefined);
  }, [exercises.length, initialIndex, lessonId]);

  function handleAnswered(result: AttemptResult) {
    setResults((previous) => [...previous, result]);
  }

  async function handleContinue() {
    if (currentIndex === exercises.length - 1) {
      try {
        await fetch("/api/lesson-progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
      } catch {
        // We still advance to the summary screen; the Home can retry reading progress on next load.
      }
    }
    setCurrentIndex((index) => Math.min(index + 1, exercises.length));
  }

  if (!exercises.length) {
    return (
      <WizardShell>
        <EmptyLessonState />
      </WizardShell>
    );
  }

  if (isDone) {
    const accuracy = Math.round((correctCount / Math.max(exercises.length, 1)) * 100);
    return (
      <WizardShell>
        <div className="grid min-h-[100dvh] place-items-center px-4 pb-24 pt-3 sm:px-6 sm:pb-28 sm:pt-4">
          <section className="w-full max-w-2xl rounded-[30px] bg-white px-4 py-6 text-center shadow-[0_24px_80px_rgba(76,51,162,0.12)] ring-1 ring-slate-200 sm:px-8 sm:py-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm sm:h-20 sm:w-20">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 sm:mt-5 sm:text-sm">Lição concluída</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:mt-2 sm:text-4xl">Mandou bem</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
              Você respondeu {exercises.length} exercícios, acertou {correctCount} e ganhou {totalXp} XP.
            </p>
            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-3">
              <Stat label="Acertos" value={correctCount} />
              <Stat label="Taxa" value={`${accuracy}%`} />
              <Stat label="XP" value={totalXp} />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-7 sm:flex-row">
              <Link href="/app">
                <Button className="w-full rounded-full px-6 text-base sm:w-auto sm:px-7 sm:text-lg" variant="purple">
                  Voltar ao início
                </Button>
              </Link>
              <Link href="/app/trilha">
                <Button className="w-full rounded-full px-6 text-base sm:w-auto sm:px-7 sm:text-lg" variant="secondary">
                  Ver trilha
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </WizardShell>
    );
  }

  return (
    <WizardShell>
      <div className="mx-auto flex w-full max-w-[940px] flex-col gap-3 px-3 pb-24 pt-3 sm:gap-4 sm:px-6 sm:pb-28 sm:pt-4 lg:gap-6 lg:pt-5">
        <TopHeader />

        <section className="rounded-[28px] border border-slate-100 bg-white px-4 py-4 shadow-[0_22px_70px_rgba(76,51,162,0.10)] sm:rounded-[34px] sm:px-7 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="flex-none text-[10px] font-black uppercase tracking-wide text-emerald-600 sm:text-lg">Lição</p>
            <h1 className="min-w-0 truncate text-[clamp(1rem,4.2vw,1.55rem)] font-black tracking-tight text-slate-950 sm:text-[clamp(2rem,3.4vw,3.1rem)]">
              {lesson.title}
            </h1>
            <div className="inline-flex flex-none items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[0.72rem] font-black text-emerald-700 sm:gap-3 sm:px-6 sm:py-3 sm:text-2xl">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-6 sm:w-6" strokeWidth={2.5} />
              <span>{currentProgress}/{exercises.length}</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <LessonProgress value={(currentProgress / exercises.length) * 100} />
          </div>
        </section>

        <section className="relative">
          <div className="pointer-events-none absolute -left-1 top-32 hidden h-12 w-12 sm:block">
            <FloatingSprite crop="12% 12%" className="h-12 w-12 rotate-[-10deg]" />
          </div>
          <div className="pointer-events-none absolute right-6 top-32 hidden h-11 w-11 sm:block">
            <FloatingSprite crop="78% 18%" className="h-11 w-11 rotate-12" />
          </div>
          <div className="pointer-events-none absolute right-10 top-[58%] hidden h-8 w-8 md:block">
            <FloatingSprite crop="50% 63%" className="h-8 w-8" />
          </div>
          <div className="pointer-events-none absolute left-10 top-[58%] hidden h-8 w-8 md:block">
            <FloatingSprite crop="28% 47%" className="h-8 w-8 rotate-[-15deg]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[940px] px-0 pb-2 sm:px-6 sm:pb-4">
            <ExerciseCard
              key={currentExercise.id}
              exercise={currentExercise}
              isLast={currentIndex === exercises.length - 1}
              onAnswered={handleAnswered}
              onContinue={handleContinue}
            />
          </div>
        </section>
      </div>

      <BottomDock />
    </WizardShell>
  );
}

function WizardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95)_0%,rgba(246,248,255,1)_48%,rgba(239,243,255,1)_100%)] text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0)_100%)]" />
      {children}
    </div>
  );
}

function TopHeader() {
  return (
    <header className="rounded-[28px] border border-slate-100 bg-white/92 px-3 py-3 shadow-[0_18px_60px_rgba(76,51,162,0.08)] backdrop-blur sm:rounded-[34px] sm:px-5 sm:py-5">
      <div className="grid grid-cols-[22px_32px_minmax(0,1fr)_auto_36px] items-center gap-1.5 sm:grid-cols-[40px_64px_minmax(0,1fr)_auto_64px] sm:gap-4">
        <Link
          aria-label="Voltar"
          className="grid h-7 w-7 flex-none place-items-center rounded-full text-[#7b4cff] transition hover:bg-[#f4efff] sm:h-12 sm:w-12"
          href="/app"
        >
          <ChevronLeft className="h-5 w-5 stroke-[2.4] sm:h-[34px] sm:w-[34px]" />
        </Link>

        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,#8d5afc_0%,#6d39f2_100%)] shadow-[0_16px_30px_rgba(111,73,246,0.35)] sm:h-16 sm:w-16 sm:rounded-[22px]">
          <Crown className="h-4 w-4 text-white sm:h-[30px] sm:w-[30px]" />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-nowrap items-center gap-1">
            <h1 className="truncate text-[clamp(1rem,4vw,1.4rem)] font-black tracking-tight text-[#0f1740] sm:text-[clamp(1.7rem,4vw,2.45rem)]">
              Matemática
            </h1>
            <span className="truncate text-[clamp(1rem,4vw,1.4rem)] font-black tracking-tight text-[#7a4ef7] sm:text-[clamp(1.7rem,4vw,2.45rem)]">
              Quest
            </span>
          </div>
        </div>

        <div className="rounded-full bg-[linear-gradient(180deg,#8d5afc_0%,#6d39f2_100%)] px-2.5 py-1 text-[0.68rem] font-black text-white shadow-[0_16px_30px_rgba(111,73,246,0.28)] sm:px-5 sm:py-3 sm:text-xl">
          Nível 7
        </div>

        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-[0_14px_30px_rgba(76,51,162,0.20)] sm:h-16 sm:w-16 sm:border-4">
          <Image alt="Avatar do topo" className="h-full w-full object-cover" height={1500} src={avatarTopImage} width={1500} />
        </div>
      </div>
    </header>
  );
}

function LessonProgress({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-3">
      <div className="h-4 overflow-hidden rounded-full bg-[#e8ecf7] sm:h-5">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#28c88f_0%,#19b87b_100%)] shadow-[0_8px_20px_rgba(40,200,143,0.35)] transition-[width] duration-300"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function FloatingSprite({ crop, className }: { crop: string; className?: string }) {
  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden">
        <Image alt="" aria-hidden="true" fill className="object-cover" sizes="64px" src={decorativeSpritesImage} style={{ objectPosition: crop }} />
      </div>
    </div>
  );
}

function BottomDock() {
  return (
    <nav className="fixed inset-x-0 bottom-2 z-40 px-2 sm:bottom-5 sm:px-4">
      <div className="mx-auto max-w-[940px] rounded-[28px] border border-slate-100 bg-white/95 px-2 py-2 shadow-[0_20px_60px_rgba(76,51,162,0.14)] backdrop-blur sm:rounded-[34px] sm:px-3 sm:py-3">
        <div className="grid grid-cols-4 gap-0.5 sm:gap-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={`flex flex-col items-center justify-center gap-0.5 rounded-[20px] py-2 text-[11px] font-black transition sm:gap-1 sm:rounded-[24px] sm:py-3 sm:text-sm ${
                  item.active ? "text-[#7a4ef7]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
                href={item.href}
                key={item.href}
              >
                <Icon size={24} strokeWidth={2.4} className={item.active ? "text-[#7a4ef7]" : "text-current"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function EmptyLessonState() {
  return (
    <div className="grid min-h-[100dvh] place-items-center px-4 pb-24 pt-3">
      <div className="max-w-md rounded-[32px] bg-white px-6 py-8 text-center shadow-[0_20px_70px_rgba(76,51,162,0.10)] ring-1 ring-slate-200">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Lição</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Sem exercícios por enquanto</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">Esta lição ainda não tem exercícios ativos no Supabase.</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[28px] bg-slate-50 px-4 py-5 text-left ring-1 ring-slate-100">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function useResults() {
  return useState<AttemptResult[]>([]);
}
