import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";

const initLessonSchema = z.object({
  lessonId: z.string().min(1),
  exerciseCount: z.number().int().nonnegative(),
});

const lessonSlugPattern = /^licao-(\d+)-(\d+)$/;

export async function POST(request: Request) {
  try {
    const body = initLessonSchema.parse(await request.json());
    const authClient = await createClient();
    const { data } = authClient ? await authClient.auth.getUser() : { data: { user: null } };
    const userId = data.user?.id;

    const supabase = createServiceClient();

    if (!supabase || !userId) {
      return NextResponse.json({ ok: false, reason: "unauthenticated" }, { status: 401 });
    }

    const slugMatch = body.lessonId.match(lessonSlugPattern);
    if (!slugMatch) {
      return NextResponse.json({ ok: false, reason: "invalid_lesson_slug" }, { status: 400 });
    }

    const moduleOrder = Number(slugMatch[1]);
    const lessonOrder = Number(slugMatch[2]);
    const { data: module } = await supabase
      .from("modules")
      .select("id")
      .eq("order_index", moduleOrder)
      .eq("is_active", true)
      .maybeSingle();

    if (!module?.id) {
      return NextResponse.json({ ok: false, reason: "module_not_found" }, { status: 404 });
    }

    const { data: currentLesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("module_id", module.id)
      .eq("order_index", lessonOrder)
      .eq("is_active", true)
      .maybeSingle();

    if (!currentLesson?.id) {
      return NextResponse.json({ ok: false, reason: "lesson_not_found" }, { status: 404 });
    }

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("completed,total_attempts")
      .eq("user_id", userId)
      .eq("lesson_id", currentLesson.id)
      .maybeSingle();

    const shouldReset =
      !progress ||
      progress.completed ||
      (progress.total_attempts ?? 0) >= body.exerciseCount;

    if (shouldReset) {
      await supabase
        .from("lesson_progress")
        .upsert({
          user_id: userId,
          lesson_id: currentLesson.id,
          completed: false,
          score: 0,
          correct_count: 0,
          wrong_count: 0,
          total_attempts: 0,
          xp_earned: 0,
          started_at: new Date().toISOString(),
          completed_at: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,lesson_id" })
        .select();
    }

    return NextResponse.json({ ok: true, shouldReset });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao iniciar lição." },
      { status: 400 },
    );
  }
}
