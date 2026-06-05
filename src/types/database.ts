export type Role = "student" | "guardian" | "admin";

export type Profile = {
  id: string;
  name: string;
  nickname: string | null;
  role: Role;
  daily_goal: number;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  is_active: boolean;
};
