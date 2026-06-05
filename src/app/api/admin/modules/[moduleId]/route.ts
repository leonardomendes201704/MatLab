import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return NextResponse.json({ id: moduleId, ...(await request.json()) });
}
