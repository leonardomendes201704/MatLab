import { Card } from "@/components/ui/Card";

export function ResultSummary({ xp, accuracy }: { xp: number; accuracy: number }) {
  return <Card><h2 className="text-xl font-black">Resumo</h2><p className="mt-2 text-slate-600">Você somou {xp} XP com {accuracy}% de acerto.</p></Card>;
}
