import { NextResponse } from "next/server";
import { exerciseSchema } from "@/lib/validations/exercise";
import { deactivateExercise, upsertExercise } from "@/repositories/exercise-repository";

export async function PUT(request: Request, { params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  const parsed = exerciseSchema.parse(await request.json());
  const { options, ...exercise } = parsed;
  void options;
  return NextResponse.json(await upsertExercise(exercise, exerciseId));
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return NextResponse.json(await deactivateExercise(exerciseId));
}
