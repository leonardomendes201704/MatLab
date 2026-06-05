import type { Exercise } from "@/types/exercise";

export function ExerciseTable({ exercises }: { exercises: Pick<Exercise, "id" | "question" | "type" | "difficulty" | "is_active">[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-slate-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Enunciado</th><th>Tipo</th><th>Dificuldade</th><th>Status</th></tr></thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr className="border-t border-slate-100" key={exercise.id}>
              <td className="p-4 font-bold text-slate-900">{exercise.question}</td>
              <td>{exercise.type}</td>
              <td>{exercise.difficulty}</td>
              <td>{exercise.is_active ? "Ativo" : "Inativo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
