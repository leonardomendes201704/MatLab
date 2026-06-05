import { Gem } from "lucide-react";

export function XPBadge({ xp }: { xp: number }) {
  return <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-black text-amber-800"><Gem size={16} />{xp} XP</span>;
}
