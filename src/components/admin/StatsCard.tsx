import { Card } from "@/components/ui/Card";

export function StatsCard({ label, value }: { label: string; value: string | number }) {
  return <Card><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></Card>;
}
