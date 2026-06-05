export function LessonNode({ index, active }: { index: number; active?: boolean }) {
  return <div className={`grid h-12 w-12 place-items-center rounded-full font-black ${active ? "bg-emerald-500 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>{index}</div>;
}
