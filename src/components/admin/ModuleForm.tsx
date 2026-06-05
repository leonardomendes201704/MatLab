import { Button } from "@/components/ui/Button";

export function ModuleForm() {
  return <form className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><input className="rounded-xl border p-3" placeholder="Título do módulo" /><textarea className="rounded-xl border p-3" placeholder="Descrição" /><Button>Salvar módulo</Button></form>;
}
