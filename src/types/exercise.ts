export type ExerciseType =
  | "multiple_choice"
  | "input"
  | "true_false"
  | "complete"
  | "word_problem"
  | "ordering"
  | "matching";

export type ExerciseOption = {
  id: string;
  option_text: string;
  is_correct?: boolean;
  order_index?: number;
};

export type Exercise = {
  id: string;
  lesson_id: string;
  skill_id?: string | null;
  type: ExerciseType;
  question: string;
  correct_answer: string;
  explanation?: string | null;
  hint?: string | null;
  difficulty: number;
  school_year: number;
  tags?: string[] | null;
  order_index: number;
  is_active: boolean;
  exercise_options?: ExerciseOption[];
};
