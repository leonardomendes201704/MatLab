import { clsx } from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ children, className, variant = "primary", ...props }: PropsWithChildren<Props>) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600",
        variant === "secondary" && "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-700 hover:bg-white/70",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
