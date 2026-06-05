import { AdminShell } from "@/components/AdminShell";
import { StudentList } from "@/components/admin/StudentList";
import { listStudents } from "@/repositories/student-repository";

export default async function AdminStudentsPage() {
  const students = await listStudents();
  return <AdminShell><h1 className="mb-5 text-3xl font-black">Alunos</h1><input className="mb-4 w-full max-w-md rounded-xl border p-3" placeholder="Buscar por nome ou email" /><StudentList students={students} /></AdminShell>;
}
