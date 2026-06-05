import { Card } from "@/components/ui/Card";

type StudentSummary = {
  name: string;
  total_xp?: number | null;
  current_streak?: number | null;
};

export function StudentProgressCard({ student }: { student: StudentSummary }) {
  return (
    <Card>
      <h3 className="font-black text-slate-950">{student.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{student.total_xp ?? 0} XP • sequência de {student.current_streak ?? 0} dias</p>
    </Card>
  );
}
