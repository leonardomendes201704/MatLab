import { AppShell } from "@/components/AppShell";
import { LessonWizard } from "@/components/exercises/LessonWizard";
import { demoExercises, lessons } from "@/lib/data/catalog";
import { listExercisesByLessonSlug } from "@/repositories/exercise-repository";

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ start?: string }>;
}) {
  const { lessonId } = await params;
  const { start } = await searchParams;
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const persistedExercises = await listExercisesByLessonSlug(lessonId);
  const exercises = persistedExercises.length ? persistedExercises : demoExercises.filter((exercise) => exercise.lesson_id === lessonId);
  const orderedExercises = [...(exercises.length ? exercises : demoExercises.slice(0, 1))]
    .sort((left, right) => left.order_index - right.order_index)
    .map((exercise) => ({
      ...exercise,
      exercise_options: exercise.exercise_options ? [...exercise.exercise_options].sort((left, right) => (left.order_index ?? 0) - (right.order_index ?? 0)) : exercise.exercise_options,
    }));
  const parsedStart = Number(start ?? 0);
  const initialIndex = Number.isFinite(parsedStart) ? Math.max(0, parsedStart) : 0;
  return <AppShell immersive hideChrome><LessonWizard lessonId={lessonId} lesson={lesson} exercises={orderedExercises} initialIndex={initialIndex} /></AppShell>;
}
