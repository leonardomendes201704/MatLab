export function calculateXp(input: { isCorrect: boolean; attemptNumber: number; usedHint: boolean }) {
  if (!input.isCorrect) return 0;
  if (input.usedHint) return 5;
  if (input.attemptNumber <= 1) return 10;
  return 6;
}

export const xpRules = {
  lessonCompleted: 20,
  dailyGoalCompleted: 30,
  moduleCompleted: 100,
};
