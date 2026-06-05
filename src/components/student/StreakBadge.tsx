import { Flame } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-sm font-black text-rose-700"><Flame size={16} />{streak} dias</span>;
}
