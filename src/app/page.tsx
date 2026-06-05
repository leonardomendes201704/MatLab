import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MascotMessage } from "@/components/student/MascotMessage";

export default function Home() {
  return (
    <main className="min-h-screen bg-sky-50">
      <section className="mx-auto grid min-h-[92vh] max-w-6xl content-center gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="font-black uppercase text-emerald-700">Reforço matemático gamificado</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-6xl">Matemática Quest</h1>
          <p className="mt-4 max-w-xl text-lg font-medium text-slate-650">Trilhas, fases, XP, revisão inteligente e progresso diário para alunos do 7º ano que precisam ganhar confiança em matemática básica.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register"><Button>Criar conta <ArrowRight size={18} /></Button></Link>
            <Link href="/login"><Button variant="secondary">Entrar</Button></Link>
          </div>
        </div>
        <div className="grid gap-4">
          <MascotMessage message="Eu sou a Lumi. Vamos treinar um pouquinho hoje e transformar erro em pista?" />
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            <Card><Sparkles className="text-amber-500" /><h2 className="mt-3 font-black">XP e streak</h2><p className="text-sm text-slate-600">Metas pequenas para manter ritmo.</p></Card>
            <Card><BookOpen className="text-emerald-600" /><h2 className="mt-3 font-black">10 módulos</h2><p className="text-sm text-slate-600">Da adição à revisão geral.</p></Card>
            <Card><ShieldCheck className="text-sky-600" /><h2 className="mt-3 font-black">Supabase RLS</h2><p className="text-sm text-slate-600">Dados protegidos por perfil.</p></Card>
          </div>
        </div>
      </section>
    </main>
  );
}
