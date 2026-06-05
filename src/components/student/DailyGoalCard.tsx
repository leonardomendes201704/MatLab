import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function DailyGoalCard({ done, goal }: { done: number; goal: number }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-950">Meta diária</h3>
        <span className="font-black text-emerald-700">{done}/{goal}</span>
      </div>
      <div className="mt-4">
        <ProgressBar value={(done / Math.max(goal, 1)) * 100} />
      </div>
    </Card>
  );
}
