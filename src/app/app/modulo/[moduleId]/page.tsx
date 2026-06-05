import { AppShell } from "@/components/AppShell";
import { LessonCard } from "@/components/student/LessonCard";
import { lessons, modules } from "@/lib/data/catalog";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const currentModule = modules.find((item) => item.id === moduleId);
  const moduleLessons = lessons.filter((lesson) => lesson.moduleId === moduleId);
  return <AppShell><h1 className="text-3xl font-black">{currentModule?.title ?? "Módulo"}</h1><p className="mt-2 text-slate-600">{currentModule?.description}</p><div className="mt-6 grid gap-3 md:grid-cols-2">{moduleLessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}</div></AppShell>;
}
