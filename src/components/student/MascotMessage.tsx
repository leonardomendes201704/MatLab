export function MascotMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-lime-100 p-4 ring-1 ring-lime-200">
      <div className="relative h-16 w-16 shrink-0 rounded-full bg-lime-400">
        <div className="absolute left-4 top-5 h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute right-4 top-5 h-2 w-2 rounded-full bg-slate-900" />
        <div className="absolute bottom-4 left-1/2 h-2 w-7 -translate-x-1/2 rounded-full border-b-4 border-slate-900" />
        <div className="absolute -right-2 top-7 h-3 w-5 rounded-full bg-lime-500" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-lime-700">Lumi</p>
        <p className="text-sm font-bold text-slate-800">{message}</p>
      </div>
    </div>
  );
}
