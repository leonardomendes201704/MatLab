import { AdminShell } from "@/components/AdminShell";
import { StatsCard } from "@/components/admin/StatsCard";
import { ExerciseTable } from "@/components/admin/ExerciseTable";
import { StudentList } from "@/components/admin/StudentList";
import { getAdminDashboard } from "@/services/admin-service";

export default async function AdminPage() {
  const dashboard = await getAdminDashboard();
  return (
    <AdminShell>
      <h1 className="text-3xl font-black">Dashboard administrativo</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatsCard label="Alunos" value={dashboard.totalStudents} />
        <StatsCard label="Responsáveis" value={dashboard.totalGuardians} />
        <StatsCard label="Exercícios" value={dashboard.totalExercises} />
        <StatsCard label="Tentativas" value={dashboard.totalAttempts} />
      </div>
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div><h2 className="mb-3 text-xl font-black">Alunos ativos</h2><StudentList students={dashboard.activeStudents} /></div>
        <div><h2 className="mb-3 text-xl font-black">Exercícios com mais erros</h2><ExerciseTable exercises={dashboard.hardestExercises} /></div>
      </section>
    </AdminShell>
  );
}
