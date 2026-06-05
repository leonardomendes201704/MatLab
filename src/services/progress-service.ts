import { getStudentProgress } from "@/repositories/student-repository";

export async function loadStudentProgress(userId?: string) {
  return getStudentProgress(userId);
}
