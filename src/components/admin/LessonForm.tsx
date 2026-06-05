import { Button } from "@/components/ui/Button";

export function LessonForm() {
  return <form className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><input className="rounded-xl border p-3" placeholder="Título da lição" /><textarea className="rounded-xl border p-3" placeholder="Explicação" /><Button>Salvar lição</Button></form>;
}
