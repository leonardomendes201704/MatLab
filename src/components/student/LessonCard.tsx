import Link from "next/link";
import { Card } from "@/components/ui/Card";

type LessonCardData = {
  id: string;
  title: string;
  description?: string | null;
  orderIndex?: number;
  order_index?: number;
};

export function LessonCard({ lesson }: { lesson: LessonCardData }) {
  return (
    <Link href={`/app/licao/${lesson.id}`}>
      <Card>
        <p className="text-xs font-black uppercase text-emerald-700">Lição {lesson.orderIndex ?? lesson.order_index}</p>
        <h3 className="mt-1 font-black text-slate-950">{lesson.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{lesson.description}</p>
      </Card>
    </Link>
  );
}
