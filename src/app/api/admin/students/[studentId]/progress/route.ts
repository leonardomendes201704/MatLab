import { NextResponse } from "next/server";
import { getStudentProgress } from "@/repositories/student-repository";

export async function GET(_request: Request, { params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  return NextResponse.json(await getStudentProgress(studentId));
}
