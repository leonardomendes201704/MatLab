import { AppShell } from "@/components/AppShell";
import { LessonWizard } from "@/components/exercises/LessonWizard";
import { demoExercises, lessons } from "@/lib/data/catalog";
import { listExercisesByLessonSlug } from "@/repositories/exercise-repository";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const persistedExercises = await listExercisesByLessonSlug(lessonId);
  const exercises = persistedExercises.length ? persistedExercises : demoExercises.filter((exercise) => exercise.lesson_id === lessonId);
  return <AppShell><LessonWizard lesson={lesson} exercises={exercises.length ? exercises : demoExercises.slice(0, 1)} /></AppShell>;
}
