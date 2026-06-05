import Link from "next/link";
import { GuardianShell } from "@/components/GuardianShell";
import { StudentProgressCard } from "@/components/guardian/StudentProgressCard";
import { Card } from "@/components/ui/Card";
import { listStudents } from "@/repositories/student-repository";

export default async function GuardianPage() {
  const students = await listStudents();
  return (
    <GuardianShell>
      <h1 className="text-3xl font-black">Acompanhamento</h1>
      <p className="mt-2 text-slate-600">Veja progresso, dificuldades e sugestões de estudo dos alunos vinculados.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{students.map((student) => <Link href={`/responsavel/aluno/${student.id}`} key={student.id}><StudentProgressCard student={student} /></Link>)}</div>
      <Card className="mt-6"><h2 className="font-black">Sugestão de estudo</h2><p className="mt-2 text-sm text-slate-600">Priorize 10 minutos por dia em subtração com empréstimo e problemas de texto.</p></Card>
    </GuardianShell>
  );
}
