import { NextResponse } from "next/server";
import { modules } from "@/lib/data/catalog";

export async function GET() {
  return NextResponse.json(modules);
}

export async function POST(request: Request) {
  return NextResponse.json(await request.json(), { status: 201 });
}
