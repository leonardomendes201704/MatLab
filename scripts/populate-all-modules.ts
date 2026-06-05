import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { moduleSeedSpecs } from "../src/lib/data/seed-content";

type ExerciseRow = { id: string; lesson_id: string; order_index: number };
type ExerciseType = "multiple_choice" | "input" | "true_false" | "complete" | "word_problem";

type GeneratedExercise = {
  type: ExerciseType;
  question: string;
  correct_answer: string;
  explanation: string;
  hint: string;
  difficulty: number;
  tags: string[];
  options?: Array<{ option_text: string; is_correct: boolean; order_index: number }>;
};

function loadLocalEnv() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const envPath = resolve(process.cwd(), ".env.local");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const index = trimmed.indexOf("=");
        if (index <= 0) continue;
        const key = trimmed.slice(0, index);
        const value = trimmed.slice(index + 1);
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

function stableId(seed: string) {
  return createHash("sha1").update(seed).digest("hex").slice(0, 32).replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function buildMultipleChoiceOptions(answer: string) {
  const numeric = Number(answer.replace(",", "."));
  if (Number.isFinite(numeric)) {
    const candidates = [numeric - 2, numeric - 1, numeric + 3, numeric + 7].map((value) => String(Math.max(0, value)));
    const unique = [answer, ...candidates.filter((value) => value !== answer)];
    return unique.slice(0, 4).map((value, index) => ({ option_text: value, is_correct: value === answer, order_index: index + 1 }));
  }
  return [answer, "1/2", "2/3", "3/4"].map((value, index) => ({ option_text: value, is_correct: value === answer, order_index: index + 1 }));
}

function exerciseType(exerciseOrder: number): ExerciseType {
  if (exerciseOrder % 5 === 0) return "word_problem";
  if (exerciseOrder % 4 === 0) return "true_false";
  if (exerciseOrder % 3 === 0) return "complete";
  if (exerciseOrder % 2 === 0) return "input";
  return "multiple_choice";
}

function generateExercise(moduleIndex: number, lessonIndex: number, exerciseOrder: number): GeneratedExercise {
  const kind = moduleIndex + 1;
  const type = exerciseType(exerciseOrder);
  const a = 12 + moduleIndex * 17 + exerciseOrder * 3 + lessonIndex;
  const b = 5 + lessonIndex * 9 + exerciseOrder * 2;
  let question = "";
  let answer = "";
  let explanation = "";
  let hint = "";

  if (kind === 1) {
    question = exerciseOrder % 5 === 0 ? `Lumi tinha ${a} pontos e ganhou mais ${b}. Com quantos pontos ficou?` : `${a} + ${b}`;
    answer = String(a + b);
    hint = "Some primeiro as unidades e depois as dezenas.";
    explanation = `${a} + ${b} = ${a + b}.`;
  } else if (kind === 2) {
    const top = a + b + 40;
    question = exerciseOrder % 5 === 0 ? `João tinha R$ ${top} e gastou R$ ${b}. Quanto sobrou?` : `${top} - ${b}`;
    answer = String(top - b);
    hint = "Pense em quanto falta para voltar ao número maior.";
    explanation = `${top} - ${b} = ${top - b}.`;
  } else if (kind === 3) {
    question = exerciseOrder % 5 === 0 ? `Uma caixa tem ${a} lápis. Quantos lápis há em ${lessonIndex + 2} caixas?` : `${a} x ${lessonIndex + 2}`;
    answer = String(a * (lessonIndex + 2));
    hint = "Multiplicar é somar grupos iguais.";
    explanation = `${a} x ${lessonIndex + 2} = ${a * (lessonIndex + 2)}.`;
  } else if (kind === 4) {
    const divisor = lessonIndex + 2;
    const quotient = exerciseOrder + 6;
    const dividend = divisor * quotient;
    question = exerciseOrder % 5 === 0 ? `${dividend} balas foram divididas entre ${divisor} crianças. Quantas cada uma recebeu?` : `${dividend} ÷ ${divisor}`;
    answer = String(quotient);
    hint = "Procure o número que multiplicado pelo divisor chega ao dividendo.";
    explanation = `${dividend} ÷ ${divisor} = ${quotient}.`;
  } else if (kind === 5) {
    question = exerciseOrder % 2 === 0 ? `${a} + ${b} x ${lessonIndex + 2}` : `(${a} + ${b}) x ${lessonIndex + 2}`;
    answer = exerciseOrder % 2 === 0 ? String(a + b * (lessonIndex + 2)) : String((a + b) * (lessonIndex + 2));
    hint = "Resolva parênteses e multiplicações antes da soma.";
    explanation = `Use a ordem das operações para chegar a ${answer}.`;
  } else if (kind === 6) {
    const numerator = (exerciseOrder % 3) + 1;
    const denominator = 4 + lessonIndex;
    question = lessonIndex === 3 ? `${numerator}/${denominator} + 1/${denominator}` : `Qual é o denominador da fração ${numerator}/${denominator}?`;
    answer = lessonIndex === 3 ? `${numerator + 1}/${denominator}` : String(denominator);
    hint = "Em frações, o denominador mostra em quantas partes o todo foi dividido.";
    explanation = `A resposta correta é ${answer}.`;
  } else if (kind === 7) {
    const x = (a / 10).toFixed(2).replace(".", ",");
    const y = (b / 10).toFixed(2).replace(".", ",");
    const sum = ((a + b) / 10).toFixed(2).replace(".", ",");
    question = `${x} + ${y}`;
    answer = sum;
    hint = "Alinhe vírgula com vírgula.";
    explanation = `${x} + ${y} = ${sum}.`;
  } else if (kind === 8) {
    const base = 40 + exerciseOrder * 10;
    const percent = [10, 25, 50, 20][lessonIndex];
    question = `Quanto é ${percent}% de ${base}?`;
    answer = String((base * percent) / 100);
    hint = "Transforme a porcentagem em parte de 100.";
    explanation = `${percent}% de ${base} é ${answer}.`;
  } else if (kind === 9) {
    question = `Em uma sala há ${lessonIndex + 4} fileiras com ${exerciseOrder + 3} carteiras. Quantas carteiras há?`;
    answer = String((lessonIndex + 4) * (exerciseOrder + 3));
    hint = "Há grupos iguais, então a multiplicação ajuda.";
    explanation = `${lessonIndex + 4} x ${exerciseOrder + 3} = ${answer}.`;
  } else {
    question = exerciseOrder % 2 === 0 ? `${a} + ${b} - ${lessonIndex + 1}` : `${a} x ${lessonIndex + 2}`;
    answer = exerciseOrder % 2 === 0 ? String(a + b - lessonIndex - 1) : String(a * (lessonIndex + 2));
    hint = "Resolva uma operação por vez.";
    explanation = `Calculando com calma, chegamos a ${answer}.`;
  }

  if (type === "true_false") {
    question = `${question} é igual a ${answer}.`;
    answer = "true";
  }

  if (type === "multiple_choice") {
    return { type, question, correct_answer: answer, explanation, hint, difficulty: Math.min(5, 1 + Math.floor((exerciseOrder - 1) / 5)), tags: ["seed", `mod-${kind}`], options: buildMultipleChoiceOptions(answer) };
  }

  return { type, question, correct_answer: answer, explanation, hint, difficulty: Math.min(5, 1 + Math.floor((exerciseOrder - 1) / 5)), tags: ["seed", `mod-${kind}`] };
}

async function main() {
  loadLocalEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: existingModules, error: modulesError } = await supabase.from("modules").select("id,order_index").order("order_index");
  if (modulesError) throw modulesError;

  const moduleRows = moduleSeedSpecs.map((spec, index) => {
    const existing = (existingModules ?? []).find((item) => item.order_index === index + 1);
    return {
      id: existing?.id ?? stableId(`module-${index + 1}`),
      title: spec.title,
      description: spec.description,
      order_index: index + 1,
      icon: spec.icon,
      color: spec.color,
      required_xp: spec.requiredXp,
      is_active: true,
    };
  });
  const { error: upsertModulesError } = await supabase.from("modules").upsert(moduleRows, { onConflict: "id" });
  if (upsertModulesError) throw upsertModulesError;

  const { data: modules } = await supabase.from("modules").select("id,title,order_index,icon,color,required_xp").order("order_index");
  if (!modules) throw new Error("Não foi possível ler os módulos.");

  for (const [moduleIndex, moduleRow] of modules.entries()) {
    const lessonTitles = moduleSeedSpecs[moduleIndex].lessonTitles;
    const { data: existingLessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id,order_index")
      .eq("module_id", moduleRow.id)
      .order("order_index");
    if (lessonsError) throw lessonsError;

    const lessonRows = lessonTitles.map((title, lessonIndex) => {
      const existing = (existingLessons ?? []).find((item) => item.order_index === lessonIndex + 1);
      return {
        id: existing?.id ?? stableId(`lesson-${moduleIndex + 1}-${lessonIndex + 1}`),
        module_id: moduleRow.id,
        title,
        description: "Treino guiado com dica e feedback imediato.",
        explanation: "Leia com calma, resolva uma parte por vez e confira o resultado.",
        example: moduleIndex < 4 ? "Exemplo: separe unidades, dezenas e centenas antes de calcular." : "Exemplo: identifique os dados importantes antes de escolher a operação.",
        order_index: lessonIndex + 1,
        xp_bonus: 20,
        is_active: true,
      };
    });

    const { error: upsertLessonsError } = await supabase.from("lessons").upsert(lessonRows, { onConflict: "id" });
    if (upsertLessonsError) throw upsertLessonsError;

    const lessonIds = lessonRows.map((lesson) => lesson.id);
    const { data: existingExercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("id,lesson_id,order_index")
      .in("lesson_id", lessonIds)
      .order("lesson_id")
      .order("order_index");
    if (exercisesError) throw exercisesError;

    const existingExercisesByLesson = new Map<string, ExerciseRow[]>();
    for (const row of existingExercises ?? []) {
      const list = existingExercisesByLesson.get(row.lesson_id) ?? [];
      list.push(row);
      existingExercisesByLesson.set(row.lesson_id, list);
    }

    const skillRows = lessonRows.map((lesson, lessonIndex) => ({
      id: stableId(`skill-${moduleIndex + 1}-${lessonIndex + 1}`),
      name: lesson.title,
      description: `Habilidade: ${lesson.title}.`,
      school_year: 7,
    }));
    const { error: upsertSkillsError } = await supabase.from("skills").upsert(skillRows, { onConflict: "id" });
    if (upsertSkillsError) throw upsertSkillsError;

    const exerciseRows: Record<string, unknown>[] = [];
    const optionRows: Record<string, unknown>[] = [];
    const exerciseIdsToClear: string[] = [];

    for (const [lessonIndex, lesson] of lessonRows.entries()) {
      const existingForLesson = existingExercisesByLesson.get(lesson.id) ?? [];
      const lessonExerciseIds: string[] = [];

      for (let exerciseOrder = 1; exerciseOrder <= 20; exerciseOrder += 1) {
        const existing = existingForLesson.find((item) => item.order_index === exerciseOrder);
        const exerciseId = existing?.id ?? stableId(`exercise-${moduleIndex + 1}-${lessonIndex + 1}-${exerciseOrder}`);
        const generated = generateExercise(moduleIndex, lessonIndex, exerciseOrder);

        exerciseRows.push({
          id: exerciseId,
          lesson_id: lesson.id,
          skill_id: skillRows[lessonIndex].id,
          type: generated.type,
          question: generated.question,
          correct_answer: generated.correct_answer,
          explanation: generated.explanation,
          hint: generated.hint,
          difficulty: generated.difficulty,
          school_year: 7,
          tags: generated.tags,
          order_index: exerciseOrder,
          is_active: true,
        });

        lessonExerciseIds.push(exerciseId);
        if (generated.options?.length) {
          for (const option of generated.options) {
            optionRows.push({
              id: stableId(`option-${exerciseId}-${option.order_index}`),
              exercise_id: exerciseId,
              option_text: option.option_text,
              is_correct: option.is_correct,
              order_index: option.order_index,
            });
          }
        }
      }

      exerciseIdsToClear.push(...lessonExerciseIds, ...(existingForLesson.filter((item) => item.order_index > 20).map((item) => item.id)));
    }

    const { error: upsertExercisesError } = await supabase.from("exercises").upsert(exerciseRows, { onConflict: "id" });
    if (upsertExercisesError) throw upsertExercisesError;

    if (exerciseIdsToClear.length) {
      const { error: clearOptionsError } = await supabase.from("exercise_options").delete().in("exercise_id", exerciseIdsToClear);
      if (clearOptionsError) throw clearOptionsError;
    }

    for (const optionChunk of chunk(optionRows, 500)) {
      if (!optionChunk.length) continue;
      const { error: insertOptionsError } = await supabase.from("exercise_options").insert(optionChunk);
      if (insertOptionsError) throw insertOptionsError;
    }
  }

  console.log("Todos os módulos foram atualizados com 10 lições e 20 exercícios por lição.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
