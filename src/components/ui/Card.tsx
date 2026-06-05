import { clsx } from "clsx";
import type { PropsWithChildren } from "react";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx("rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200", className)}>{children}</div>;
}
