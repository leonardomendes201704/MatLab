import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { loadStudentProgress } from "@/services/progress-service";

export async function GET() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return NextResponse.json(await loadStudentProgress(data.user?.id));
}
