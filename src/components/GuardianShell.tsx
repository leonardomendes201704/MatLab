import Link from "next/link";
import type { PropsWithChildren } from "react";

export function GuardianShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="border-b border-emerald-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link className="font-black text-slate-950" href="/responsavel">Painel do responsável</Link>
          <Link className="font-bold text-emerald-700" href="/app">App do aluno</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
