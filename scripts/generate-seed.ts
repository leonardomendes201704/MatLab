import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { moduleSeedSpecs } from "../src/lib/data/seed-content";

const colors = ["emerald", "sky", "amber", "rose", "indigo", "teal", "cyan", "fuchsia", "lime", "orange"];
const icons = ["Plus", "Minus", "X", "Divide", "Parentheses", "PieChart", "BadgeCent", "Percent", "BookOpen", "Sparkles"];

function uuid(seed: number) {
  const hex = seed.toString(16).padStart(32, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function q(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function arr(values: string[]) {
  return `array[${values.map(q).join(",")}]`;
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

function exerciseType(exerciseOrder: number) {
  if (exerciseOrder % 5 === 0) return "word_problem";
  if (exerciseOrder % 4 === 0) return "true_false";
  if (exerciseOrder % 3 === 0) return "complete";
  if (exerciseOrder % 2 === 0) return "input";
  return "multiple_choice";
}

function generateExercise(moduleIndex: number, lessonIndex: number, exerciseOrder: number) {
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

  return {
    type,
    question,
    answer,
    explanation,
    hint,
    difficulty: Math.min(5, 1 + Math.floor((exerciseOrder - 1) / 5)),
    options: type === "multiple_choice" ? buildMultipleChoiceOptions(answer) : [],
  };
}

const lines = ["-- Seed gerado automaticamente para Matemática Quest.", "begin;"];

moduleSeedSpecs.forEach((moduleSpec, moduleIndex) => {
  const moduleId = uuid(1000 + moduleIndex);
  lines.push(
    `insert into public.modules (id,title,description,order_index,icon,color,required_xp,is_active) values (${q(moduleId)},${q(moduleSpec.title)},${q(`Módulo de ${moduleSpec.title.toLowerCase()} para o 7º ano.`)},${moduleIndex + 1},${q(icons[moduleIndex])},${q(colors[moduleIndex])},${moduleSpec.requiredXp},true) on conflict (id) do update set title = excluded.title, description = excluded.description, order_index = excluded.order_index, icon = excluded.icon, color = excluded.color, required_xp = excluded.required_xp, is_active = excluded.is_active;`,
  );

  moduleSpec.lessonTitles.forEach((lessonTitle, lessonIndex) => {
    const lessonId = uuid(2000 + moduleIndex * 10 + lessonIndex);
    const skillId = uuid(3000 + moduleIndex * 10 + lessonIndex);
    lines.push(`insert into public.skills (id,name,description,school_year) values (${q(skillId)},${q(lessonTitle)},${q(`Habilidade: ${lessonTitle}.`)},7) on conflict (id) do update set name = excluded.name, description = excluded.description, school_year = excluded.school_year;`);
    lines.push(`insert into public.lessons (id,module_id,title,description,explanation,example,order_index,xp_bonus,is_active) values (${q(lessonId)},${q(moduleId)},${q(lessonTitle)},${q("Treino guiado com dica e feedback imediato.")},${q("Resolva uma parte por vez e confira seu raciocínio.")},${q("Exemplo resolvido aparece antes da prática.")},${lessonIndex + 1},20,true) on conflict (id) do update set title = excluded.title, description = excluded.description, explanation = excluded.explanation, example = excluded.example, order_index = excluded.order_index, xp_bonus = excluded.xp_bonus, is_active = excluded.is_active;`);

    for (let exerciseIndex = 1; exerciseIndex <= 20; exerciseIndex += 1) {
      const ex = generateExercise(moduleIndex, lessonIndex, exerciseIndex);
      const exerciseId = uuid(4000 + moduleIndex * 1000 + lessonIndex * 100 + exerciseIndex);
      lines.push(`insert into public.exercises (id,lesson_id,skill_id,type,question,correct_answer,explanation,hint,difficulty,school_year,tags,order_index,is_active) values (${q(exerciseId)},${q(lessonId)},${q(skillId)},${q(ex.type)},${q(ex.question)},${q(ex.answer)},${q(ex.explanation)},${q(ex.hint)},${ex.difficulty},7,${arr([moduleSpec.title.toLowerCase(), lessonTitle.toLowerCase()])},${exerciseIndex},true) on conflict (id) do update set lesson_id = excluded.lesson_id, skill_id = excluded.skill_id, type = excluded.type, question = excluded.question, correct_answer = excluded.correct_answer, explanation = excluded.explanation, hint = excluded.hint, difficulty = excluded.difficulty, school_year = excluded.school_year, tags = excluded.tags, order_index = excluded.order_index, is_active = excluded.is_active;`);

      if (ex.options.length) {
        ex.options.forEach((option, optionIndex) => {
          lines.push(`insert into public.exercise_options (id,exercise_id,option_text,is_correct,order_index) values (${q(uuid(8000 + moduleIndex * 4000 + lessonIndex * 400 + exerciseIndex * 10 + optionIndex))},${q(exerciseId)},${q(option.option_text)},${option.is_correct},${option.order_index}) on conflict (id) do update set option_text = excluded.option_text, is_correct = excluded.is_correct, order_index = excluded.order_index;`);
        });
      }
    }
  });
});

lines.push("commit;");

const outputPath = join(process.cwd(), "supabase", "generated-seed.sql");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Seed gerado em ${outputPath} com 10 módulos, 100 lições e 2000 exercícios.`);
