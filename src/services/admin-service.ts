import { listExercises } from "@/repositories/exercise-repository";
import { listStudents } from "@/repositories/student-repository";

export async function getAdminDashboard() {
  const [students, exercises] = await Promise.all([listStudents(), listExercises()]);
  return {
    totalStudents: students.length,
    totalGuardians: 0,
    totalExercises: exercises.length,
    totalAttempts: 0,
    averageAccuracy: 0,
    hardestExercises: exercises.slice(0, 5),
    activeStudents: students.slice(0, 5),
  };
}
