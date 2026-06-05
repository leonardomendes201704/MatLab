import { NextResponse } from "next/server";
import { lessons } from "@/lib/data/catalog";

export async function GET() {
  return NextResponse.json(lessons);
}

export async function POST(request: Request) {
  return NextResponse.json(await request.json(), { status: 201 });
}
