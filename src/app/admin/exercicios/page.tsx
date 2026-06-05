import Link from "next/link";
import { AdminShell } from "@/components/AdminShell";
import { ExerciseTable } from "@/components/admin/ExerciseTable";
import { Button } from "@/components/ui/Button";
import { listExercises } from "@/repositories/exercise-repository";

export default async function ExercisesAdminPage() {
  const exercises = await listExercises();
  return <AdminShell><div className="mb-5 flex items-center justify-between"><h1 className="text-3xl font-black">Exercícios</h1><Link href="/admin/exercicios/novo"><Button>Novo</Button></Link></div><ExerciseTable exercises={exercises} /></AdminShell>;
}
