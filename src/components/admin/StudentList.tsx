import Link from "next/link";

export type StudentRow = {
  id: string;
  name: string;
  total_xp?: number | null;
};

export function StudentList({ students }: { students: StudentRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      {students.map((student) => (
        <Link className="flex items-center justify-between border-b border-slate-100 p-4 last:border-0" href={`/admin/alunos/${student.id}`} key={student.id}>
          <span className="font-bold text-slate-900">{student.name}</span>
          <span className="text-sm text-slate-500">{student.total_xp ?? 0} XP</span>
        </Link>
      ))}
    </div>
  );
}
