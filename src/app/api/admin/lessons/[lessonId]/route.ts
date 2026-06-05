import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  return NextResponse.json({ id: lessonId, ...(await request.json()) });
}
