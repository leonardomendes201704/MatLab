export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-2">
      {label ? <div className="text-sm font-bold text-slate-700">{label}</div> : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
