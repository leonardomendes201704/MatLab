import Link from "next/link";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/alunos", "Alunos"],
  ["/admin/responsaveis", "Responsáveis"],
  ["/admin/modulos", "Módulos"],
  ["/admin/licoes", "Lições"],
  ["/admin/exercicios", "Exercícios"],
  ["/admin/relatorios", "Relatórios"],
];

export function SidebarAdmin() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <h1 className="mb-6 text-xl font-black">Admin Quest</h1>
      <nav className="grid gap-1">
        {links.map(([href, label]) => <Link className="rounded-xl px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href={href} key={href}>{label}</Link>)}
      </nav>
    </aside>
  );
}
