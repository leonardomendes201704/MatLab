"use client";

import Link from "next/link";
import { BookOpen, Home, RotateCcw, User } from "lucide-react";

const items = [
  { href: "/app", label: "Início", icon: Home },
  { href: "/app/trilha", label: "Trilha", icon: BookOpen },
  { href: "/app/revisao", label: "Revisão", icon: RotateCcw },
  { href: "/app/perfil", label: "Perfil", icon: User },
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link className="flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-bold text-slate-600" href={item.href} key={item.href}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
