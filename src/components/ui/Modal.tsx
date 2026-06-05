import type { PropsWithChildren } from "react";

export function Modal({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
