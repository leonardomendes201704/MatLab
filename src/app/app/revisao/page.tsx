import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { getReviewExercises } from "@/services/review-service";

export default async function ReviewPage() {
  const exercises = await getReviewExercises();
  return <AppShell><h1 className="mb-2 text-3xl font-black">Revisão inteligente</h1><p className="mb-5 text-slate-600">Exercícios priorizados pelos assuntos que mais precisam de prática.</p><div className="grid gap-4">{exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}</div></AppShell>;
}
