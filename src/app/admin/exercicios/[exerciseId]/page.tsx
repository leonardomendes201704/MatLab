import { AdminShell } from "@/components/AdminShell";
import { ExerciseForm } from "@/components/admin/ExerciseForm";

export default async function EditExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return <AdminShell><h1 className="mb-2 text-3xl font-black">Editar exercício</h1><p className="mb-5 text-slate-600">{exerciseId}</p><ExerciseForm /></AdminShell>;
}
