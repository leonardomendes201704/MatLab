import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Card } from "@/components/ui/Card";
import { demoExercises, lessons } from "@/lib/data/catalog";
import { listExercisesByLessonSlug } from "@/repositories/exercise-repository";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const persistedExercises = await listExercisesByLessonSlug(lessonId);
  const exercises = persistedExercises.length ? persistedExercises : demoExercises.filter((exercise) => exercise.lesson_id === lessonId);
  return <AppShell><div className="grid gap-5"><Card><h1 className="text-2xl font-black">{lesson.title}</h1><p className="mt-2 text-slate-600">{lesson.explanation}</p><p className="mt-3 rounded-xl bg-sky-50 p-3 text-sm font-bold text-sky-800">{lesson.example}</p></Card>{(exercises.length ? exercises : demoExercises.slice(0, 1)).map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}</div></AppShell>;
}
