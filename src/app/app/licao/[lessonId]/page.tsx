import { AppShell } from "@/components/AppShell";
import { LessonWizard } from "@/components/exercises/LessonWizard";
import { demoExercises, lessons } from "@/lib/data/catalog";
import { listExercisesByLessonSlug } from "@/repositories/exercise-repository";
import type { Exercise } from "@/types/exercise";
import { shuffleItems } from "@/utils/shuffle";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const persistedExercises = await listExercisesByLessonSlug(lessonId);
  const exercises = persistedExercises.length ? persistedExercises : demoExercises.filter((exercise) => exercise.lesson_id === lessonId);
  const shuffledExercises = shuffleExercises(exercises.length ? exercises : demoExercises.slice(0, 1));
  return <AppShell immersive hideChrome><LessonWizard lesson={lesson} exercises={shuffledExercises} /></AppShell>;
}

function shuffleExercises(exercises: Exercise[]) {
  return shuffleItems(exercises).map((exercise) => ({
    ...exercise,
    exercise_options: exercise.exercise_options ? shuffleItems(exercise.exercise_options) : exercise.exercise_options,
  }));
}
