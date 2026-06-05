import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/Card";
import { demoProgress } from "@/lib/data/catalog";

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  return <AdminShell><h1 className="text-3xl font-black">Aluno {studentId}</h1><div className="mt-6 grid gap-4 md:grid-cols-3"><Card><b>XP</b><p className="text-3xl font-black">{demoProgress.totalXp}</p></Card><Card><b>Acertos</b><p className="text-3xl font-black">{demoProgress.accuracy}%</p></Card><Card><b>Streak</b><p className="text-3xl font-black">{demoProgress.currentStreak}</p></Card></div><Card className="mt-4"><h2 className="font-black">Histórico e dificuldades</h2><p className="mt-2 text-slate-600">{demoProgress.weakSkills.join(", ")}</p></Card></AdminShell>;
}
