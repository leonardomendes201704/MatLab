import { NextResponse } from "next/server";
import { listStudents } from "@/repositories/student-repository";

export async function GET() {
  return NextResponse.json(await listStudents());
}
