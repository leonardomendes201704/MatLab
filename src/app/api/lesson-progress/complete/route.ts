import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { archiveLessonProgress } from "@/repositories/student-repository";
import { z } from "zod";

const completeLessonSchema = z.object({
  lessonId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = completeLessonSchema.parse(await request.json());
    const supabase = await createClient();
    const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
    const userId = data.user?.id;

    if (!supabase || !userId) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const { error } = await supabase
      .from("lesson_progress")
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("lesson_id", body.lessonId);

    if (error) throw error;

    await archiveLessonProgress(userId, body.lessonId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao concluir lição." },
      { status: 400 },
    );
  }
}
