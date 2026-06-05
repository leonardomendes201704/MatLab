import { z } from "zod";

export const exerciseSchema = z.object({
  lesson_id: z.string().min(1, "Selecione uma lição."),
  skill_id: z.string().optional().nullable(),
  type: z.enum(["multiple_choice", "input", "true_false", "complete", "word_problem", "ordering", "matching"]),
  question: z.string().min(1, "Informe o enunciado."),
  correct_answer: z.string().min(1, "Informe a resposta correta."),
  explanation: z.string().optional().nullable(),
  hint: z.string().optional().nullable(),
  difficulty: z.coerce.number().int().min(1).max(5),
  school_year: z.coerce.number().int().default(7),
  tags: z.array(z.string()).default([]),
  order_index: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
  options: z.array(z.object({
    option_text: z.string().min(1),
    is_correct: z.boolean().default(false),
    order_index: z.number().default(0),
  })).default([]),
}).superRefine((data, ctx) => {
  if (data.type === "multiple_choice") {
    if (data.options.length < 2) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "Múltipla escolha exige ao menos 2 alternativas." });
    }
    if (!data.options.some((option) => option.is_correct)) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "Marque uma alternativa correta." });
    }
  }
});

export const attemptSchema = z.object({
  exerciseId: z.string().min(1),
  answer: z.string().min(1),
  usedHint: z.boolean().default(false),
  timeSpentSeconds: z.coerce.number().int().min(0).default(0),
});
