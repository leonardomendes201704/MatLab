import { AdminShell } from "@/components/AdminShell";
import { ModuleForm } from "@/components/admin/ModuleForm";
import { modules } from "@/lib/data/catalog";

export default function ModulesAdminPage() {
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Módulos</h1><ModuleForm /><div className="mt-6 grid gap-3">{modules.map((module) => <div className="rounded-2xl bg-white p-4 font-bold ring-1 ring-slate-200" key={module.id}>{module.title}</div>)}</div></AdminShell>;
}
