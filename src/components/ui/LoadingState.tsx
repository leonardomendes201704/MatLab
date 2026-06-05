export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return <div className="rounded-2xl bg-white p-6 text-center font-bold text-slate-600">{label}</div>;
}
