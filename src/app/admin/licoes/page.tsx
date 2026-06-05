import { AdminShell } from "@/components/AdminShell";
import { LessonForm } from "@/components/admin/LessonForm";
import { lessons } from "@/lib/data/catalog";

export default function LessonsAdminPage() {
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Lições</h1><LessonForm /><div className="mt-6 grid gap-3">{lessons.slice(0, 12).map((lesson) => <div className="rounded-2xl bg-white p-4 font-bold ring-1 ring-slate-200" key={lesson.id}>{lesson.title}</div>)}</div></AdminShell>;
}
