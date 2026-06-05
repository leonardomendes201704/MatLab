import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DailyGoalCard } from "@/components/student/DailyGoalCard";
import { MascotMessage } from "@/components/student/MascotMessage";
import { ModuleCard } from "@/components/student/ModuleCard";
import { StreakBadge } from "@/components/student/StreakBadge";
import { XPBadge } from "@/components/student/XPBadge";
import { modules } from "@/lib/data/catalog";
import { loadStudentProgress } from "@/services/progress-service";

export default async function StudentDashboard() {
  const progress = await loadStudentProgress();
  return (
    <AppShell>
      <div className="grid gap-5">
        <div>
          <p className="font-black text-emerald-700">Olá, explorador</p>
          <h1 className="text-3xl font-black text-slate-950">Pronto para treinar hoje?</h1>
        </div>
        <MascotMessage message="Um exercício por vez. Se errar, a gente aprende com a pista." />
        <div className="flex flex-wrap gap-3"><XPBadge xp={progress.totalXp} /><StreakBadge streak={progress.currentStreak} /><span className="rounded-full bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-slate-200">Melhor: {progress.bestStreak} dias</span></div>
        <div className="grid gap-4 md:grid-cols-3">
          <DailyGoalCard done={progress.todayDone} goal={progress.dailyGoal} />
          <Card><p className="text-sm font-bold text-slate-500">Exercícios feitos</p><p className="mt-2 text-3xl font-black">{progress.exercisesDone}</p></Card>
          <Card><p className="text-sm font-bold text-slate-500">Taxa de acerto</p><p className="mt-2 text-3xl font-black">{progress.accuracy}%</p></Card>
        </div>
        <div className="grid gap-3 sm:grid-cols-2"><Link href="/app/licao/licao-1-1"><Button className="w-full">Continuar treino</Button></Link><Link href="/app/revisao"><Button className="w-full" variant="secondary">Revisar meus erros</Button></Link></div>
        <section className="grid gap-3"><h2 className="text-xl font-black">Trilha</h2>{modules.slice(0, 5).map((module, index) => <ModuleCard key={module.id} module={module} unlocked={index < 3} />)}</section>
      </div>
    </AppShell>
  );
}
