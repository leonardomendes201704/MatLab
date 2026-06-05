import { NextResponse } from "next/server";
import { exerciseSchema } from "@/lib/validations/exercise";
import { listExercises, upsertExercise } from "@/repositories/exercise-repository";

export async function GET() {
  return NextResponse.json(await listExercises());
}

export async function POST(request: Request) {
  const parsed = exerciseSchema.parse(await request.json());
  const { options, ...exercise } = parsed;
  void options;
  return NextResponse.json(await upsertExercise(exercise), { status: 201 });
}
