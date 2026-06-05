import { GuardianShell } from "@/components/GuardianShell";
import { Card } from "@/components/ui/Card";
import { demoProgress } from "@/lib/data/catalog";

export default async function GuardianStudentPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  return (
    <GuardianShell>
      <h1 className="text-3xl font-black">Detalhes do aluno</h1>
      <p className="mt-1 text-slate-600">ID: {studentId}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm font-bold text-slate-500">XP total</p><p className="text-3xl font-black">{demoProgress.totalXp}</p></Card>
        <Card><p className="text-sm font-bold text-slate-500">Taxa de acerto</p><p className="text-3xl font-black">{demoProgress.accuracy}%</p></Card>
        <Card><p className="text-sm font-bold text-slate-500">Streak</p><p className="text-3xl font-black">{demoProgress.currentStreak}</p></Card>
      </div>
      <Card className="mt-4"><h2 className="font-black">Principais dificuldades</h2><p className="mt-2 text-sm text-slate-600">{demoProgress.weakSkills.join(", ")}</p></Card>
    </GuardianShell>
  );
}
