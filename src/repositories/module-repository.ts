import { lessons, modules } from "@/lib/data/catalog";
import { createServiceClient } from "@/lib/supabase/server";

export async function listModules() {
  const supabase = createServiceClient();
  if (!supabase) return modules;
  const { data } = await supabase.from("modules").select("*").order("order_index");
  return data ?? modules;
}

export async function listLessons(moduleId?: string) {
  const supabase = createServiceClient();
  if (!supabase) return moduleId ? lessons.filter((lesson) => lesson.moduleId === moduleId) : lessons;

  let query = supabase.from("lessons").select("*").order("order_index");
  if (moduleId) query = query.eq("module_id", moduleId);
  const { data } = await query;
  return data ?? [];
}
