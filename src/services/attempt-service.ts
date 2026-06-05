import { getExerciseById } from "@/repositories/exercise-repository";
import { applyProgress, countAttemptsForExercise, recordAttempt } from "@/repositories/progress-repository";
import { calculateXp } from "@/services/xp-service";
import { isCorrectAnswer } from "@/utils/math";

export async function submitAttempt(input: {
  userId: string;
  exerciseId: string;
  answer: string;
  usedHint: boolean;
  timeSpentSeconds: number;
}) {
  const exercise = await getExerciseById(input.exerciseId);
  if (!exercise) {
    throw new Error("Exercício não encontrado ou inativo.");
  }

  const previousAttempts = await countAttemptsForExercise(input.userId, input.exerciseId);
  const attemptNumber = previousAttempts + 1;
  const isCorrect = isCorrectAnswer(input.answer, exercise.correct_answer);
  const xpEarned = calculateXp({ isCorrect, attemptNumber, usedHint: input.usedHint });

  await recordAttempt({
    userId: input.userId,
    exerciseId: exercise.id,
    lessonId: exercise.lesson_id,
    answer: input.answer,
    isCorrect,
    usedHint: input.usedHint,
    attemptNumber,
    xpEarned,
    timeSpentSeconds: input.timeSpentSeconds,
  });

  await applyProgress({
    userId: input.userId,
    lessonId: exercise.lesson_id,
    exerciseId: exercise.id,
    skillId: exercise.skill_id,
    isCorrect,
    xpEarned,
    timeSpentSeconds: input.timeSpentSeconds,
  });

  return {
    isCorrect,
    xpEarned,
    attemptNumber,
    feedback: isCorrect
      ? `Muito bem! Você acertou e ganhou ${xpEarned} XP.`
      : "Quase! Veja a dica e tente novamente. Lembre-se de resolver uma parte de cada vez.",
    explanation: exercise.explanation,
    hint: exercise.hint,
  };
}
