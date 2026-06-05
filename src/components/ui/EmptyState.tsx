export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      {text ? <p className="mt-2 text-sm text-slate-600">{text}</p> : null}
    </div>
  );
}
