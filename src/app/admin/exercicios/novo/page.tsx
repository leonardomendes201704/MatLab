import { AdminShell } from "@/components/AdminShell";
import { ExerciseForm } from "@/components/admin/ExerciseForm";

export default function NewExercisePage() {
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Novo exercício</h1><ExerciseForm /></AdminShell>;
}
