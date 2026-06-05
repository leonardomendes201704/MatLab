export function normalizeAnswer(value: string) {
  return value.trim().toLowerCase().replace(",", ".").replace(/\s+/g, " ");
}

export function isCorrectAnswer(answer: string, correctAnswer: string) {
  return normalizeAnswer(answer) === normalizeAnswer(correctAnswer);
}
