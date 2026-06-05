import Link from "next/link";
import type { PropsWithChildren } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";

export function AppShell({
  children,
  immersive = false,
  hideChrome = false,
}: PropsWithChildren<{ immersive?: boolean; hideChrome?: boolean }>) {
  return (
    <div className={`min-h-dvh bg-sky-50 ${immersive ? "pb-0" : "pb-24 md:pb-0"}`}>
      {hideChrome ? null : (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link className="text-lg font-black text-slate-950" href="/app">
              Matemática Quest
            </Link>
            <div className="hidden gap-2 md:flex">
              <Link className="rounded-xl px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="/app/trilha">
                Trilha
              </Link>
              <Link className="rounded-xl px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="/app/revisao">
                Revisão
              </Link>
              <Link className="rounded-xl px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="/app/perfil">
                Perfil
              </Link>
            </div>
          </div>
        </header>
      )}
      <main className={`mx-auto w-full ${hideChrome ? "max-w-none px-0" : "max-w-6xl px-4"} ${immersive ? "py-0" : "py-6"}`}>{children}</main>
      {immersive || hideChrome ? null : <BottomNavigation />}
    </div>
  );
}
