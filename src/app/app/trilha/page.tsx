import { AppShell } from "@/components/AppShell";
import { ModuleCard } from "@/components/student/ModuleCard";
import { modules } from "@/lib/data/catalog";

export default function TrailPage() {
  return <AppShell><h1 className="mb-5 text-3xl font-black">Trilha de aprendizado</h1><div className="grid gap-3 md:grid-cols-2">{modules.map((module, index) => <ModuleCard key={module.id} module={module} unlocked={index < 4} />)}</div></AppShell>;
}
