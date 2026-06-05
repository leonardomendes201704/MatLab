import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/ui/Card";

export default function ReportsPage() {
  const reports = ["Exercícios com maior taxa de erro", "Alunos com baixa atividade", "Progresso por módulo", "Taxa média por habilidade", "Tentativas por dia"];
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Relatórios</h1><div className="grid gap-4 md:grid-cols-2">{reports.map((report) => <Card key={report}><h2 className="font-black">{report}</h2><p className="mt-2 text-sm text-slate-600">Pronto para conectar a gráficos a partir das tabelas do Supabase.</p></Card>)}</div></AdminShell>;
}
