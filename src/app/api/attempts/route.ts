import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { attemptSchema } from "@/lib/validations/exercise";
import { submitAttempt } from "@/services/attempt-service";

export async function POST(request: Request) {
  const body = attemptSchema.parse(await request.json());
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  const userId = data.user?.id ?? "demo-user";

  const result = await submitAttempt({
    userId,
    exerciseId: body.exerciseId,
    answer: body.answer,
    usedHint: body.usedHint,
    timeSpentSeconds: body.timeSpentSeconds,
  });

  return NextResponse.json(result);
}
