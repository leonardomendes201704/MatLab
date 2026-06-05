import type { Exercise } from "@/types/exercise";
import type { StudentProgress } from "@/types/progress";
import { moduleSeedSpecs } from "@/lib/data/seed-content";

export const modules = moduleSeedSpecs.map((module) => ({
  id: module.id,
  title: module.title,
  description: module.description,
  color: module.color,
  icon: module.icon,
  requiredXp: module.requiredXp,
}));

export const lessons = moduleSeedSpecs.flatMap((module, moduleIndex) =>
  module.lessonTitles.map((title, lessonIndex) => ({
    id: `licao-${moduleIndex + 1}-${lessonIndex + 1}`,
    moduleId: modules[moduleIndex].id,
    title,
    description: "Treino curto com explicação, dica e feedback imediato.",
    explanation: "Leia com calma, resolva uma parte por vez e confira o resultado.",
    example: moduleIndex < 4 ? "Exemplo: separe unidades, dezenas e centenas antes de calcular." : "Exemplo: identifique os dados importantes antes de escolher a operação.",
    orderIndex: lessonIndex + 1,
  })),
);

export const demoExercises: Exercise[] = [
  {
    id: "ex-demo-1",
    lesson_id: "licao-1-1",
    type: "multiple_choice",
    question: "235 + 148 é igual a quanto?",
    correct_answer: "383",
    explanation: "Some 235 + 148 por partes: 200 + 100, 30 + 40 e 5 + 8.",
    hint: "Comece pelas unidades: 5 + 8 = 13.",
    difficulty: 1,
    school_year: 7,
    tags: ["adição", "reagrupamento"],
    order_index: 1,
    is_active: true,
    exercise_options: [
      { id: "op1", option_text: "373" },
      { id: "op2", option_text: "383", is_correct: true },
      { id: "op3", option_text: "393" },
      { id: "op4", option_text: "408" },
    ],
  },
  {
    id: "ex-demo-2",
    lesson_id: "licao-2-1",
    type: "input",
    question: "908 - 456 é igual a quanto?",
    correct_answer: "452",
    explanation: "908 - 456 = 452. Confira unidade, dezena e centena.",
    hint: "Pense em quanto falta de 456 até 908.",
    difficulty: 1,
    school_year: 7,
    tags: ["subtração"],
    order_index: 2,
    is_active: true,
  },
  {
    id: "ex-demo-3",
    lesson_id: "licao-8-1",
    type: "true_false",
    question: "10% de 100 é 10.",
    correct_answer: "true",
    explanation: "10% significa uma parte de dez. Uma parte de dez de 100 é 10.",
    hint: "Divida 100 por 10.",
    difficulty: 1,
    school_year: 7,
    tags: ["porcentagem"],
    order_index: 3,
    is_active: true,
  },
];

export const demoProgress: StudentProgress = {
  totalXp: 240,
  currentStreak: 4,
  bestStreak: 8,
  dailyGoal: 10,
  todayDone: 6,
  exercisesDone: 86,
  accuracy: 78,
  completedLessons: 7,
  completedModules: 1,
  weakSkills: ["Subtração com empréstimo", "Frações equivalentes", "Problemas com dinheiro"],
};
