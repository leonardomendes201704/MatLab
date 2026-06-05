import Link from "next/link";
import { Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

type ModuleCardData = {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
};

export function ModuleCard({ module, unlocked = true }: { module: ModuleCardData; unlocked?: boolean }) {
  return (
    <Link href={unlocked ? `/app/modulo/${module.id}` : "/app/trilha"} aria-disabled={!unlocked}>
      <Card className="flex items-center gap-4">
        <div className={`grid h-14 w-14 place-items-center rounded-2xl ${module.color ?? "bg-emerald-500"} text-white`}>
          {unlocked ? <Play /> : <Lock />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-950">{module.title}</h3>
          <p className="text-sm text-slate-600">{module.description}</p>
        </div>
      </Card>
    </Link>
  );
}
