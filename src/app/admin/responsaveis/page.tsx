import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GuardiansAdminPage() {
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Responsáveis</h1><Card><h2 className="font-black">Vincular aluno</h2><div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"><input className="rounded-xl border p-3" placeholder="ID do responsável" /><input className="rounded-xl border p-3" placeholder="ID do aluno" /><Button>Vincular</Button></div></Card></AdminShell>;
}
