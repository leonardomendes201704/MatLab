import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const moduleTitles = [
  ["Adição", ["Adição simples", "Adição com reagrupamento", "Adição com números maiores", "Problemas de adição"]],
  ["Subtração", ["Subtração simples", "Subtração com empréstimo", "Subtração com números maiores", "Problemas de subtração"]],
  ["Multiplicação", ["Tabuada", "Multiplicação por 1 algarismo", "Multiplicação por 2 algarismos", "Problemas de multiplicação"]],
  ["Divisão", ["Divisão exata", "Divisão com resto", "Divisão por 1 algarismo", "Problemas de divisão"]],
  ["Expressões numéricas", ["Ordem das operações", "Parênteses", "Mistura de operações", "Problemas com expressões"]],
  ["Frações básicas", ["Conceito de fração", "Comparação de frações", "Frações equivalentes", "Soma de frações com mesmo denominador"]],
  ["Números decimais", ["Leitura de decimais", "Soma com decimais", "Subtração com decimais", "Situações com dinheiro"]],
  ["Porcentagem básica", ["10%", "25%", "50%", "Descontos simples"]],
  ["Problemas matemáticos", ["Interpretação de texto", "Escolha da operação correta", "Problemas com dinheiro", "Problemas com medidas"]],
  ["Revisão geral", ["Mistura de operações", "Desafios rápidos", "Simulados simples", "Correção guiada"]],
] as const;

const colors = ["emerald", "sky", "amber", "rose", "indigo", "teal", "cyan", "fuchsia", "lime", "orange"];
const icons = ["Plus", "Minus", "X", "Divide", "Parentheses", "PieChart", "BadgeCent", "Percent", "BookOpen", "Sparkles"];

function uuid(seed: number) {
  const hex = seed.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${hex}`;
}

function q(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function arr(values: string[]) {
  return `array[${values.map(q).join(",")}]`;
}

function makeExercise(moduleIndex: number, lessonIndex: number, itemIndex: number) {
  const a = 12 + moduleIndex * 17 + itemIndex * 3 + lessonIndex;
  const b = 5 + lessonIndex * 9 + itemIndex * 2;
  const kind = moduleIndex + 1;
  let question = "";
  let answer = "";
  let explanation = "";
  let hint = "";
  const type: "multiple_choice" | "input" | "true_false" | "complete" | "word_problem" = itemIndex % 5 === 0 ? "word_problem" : itemIndex % 4 === 0 ? "true_false" : itemIndex % 3 === 0 ? "complete" : itemIndex % 2 === 0 ? "input" : "multiple_choice";

  if (kind === 1) {
    question = itemIndex % 5 === 0 ? `Lumi tinha ${a} pontos e ganhou mais ${b}. Com quantos pontos ficou?` : `${a} + ${b}`;
    answer = String(a + b);
    hint = "Some primeiro as unidades e depois as dezenas.";
    explanation = `${a} + ${b} = ${a + b}.`;
  } else if (kind === 2) {
    const top = a + b + 40;
    question = itemIndex % 5 === 0 ? `João tinha R$ ${top} e gastou R$ ${b}. Quanto sobrou?` : `${top} - ${b}`;
    answer = String(top - b);
    hint = "Pense em quanto falta para voltar ao número maior.";
    explanation = `${top} - ${b} = ${top - b}.`;
  } else if (kind === 3) {
    question = itemIndex % 5 === 0 ? `Uma caixa tem ${a} lápis. Quantos lápis há em ${lessonIndex + 2} caixas?` : `${a} x ${lessonIndex + 2}`;
    answer = String(a * (lessonIndex + 2));
    hint = "Multiplicar é somar grupos iguais.";
    explanation = `${a} x ${lessonIndex + 2} = ${a * (lessonIndex + 2)}.`;
  } else if (kind === 4) {
    const divisor = lessonIndex + 2;
    const quotient = itemIndex + 6;
    const dividend = divisor * quotient;
    question = itemIndex % 5 === 0 ? `${dividend} balas foram divididas entre ${divisor} crianças. Quantas cada uma recebeu?` : `${dividend} ÷ ${divisor}`;
    answer = String(quotient);
    hint = "Procure o número que multiplicado pelo divisor chega ao dividendo.";
    explanation = `${dividend} ÷ ${divisor} = ${quotient}.`;
  } else if (kind === 5) {
    question = itemIndex % 2 === 0 ? `${a} + ${b} x ${lessonIndex + 2}` : `(${a} + ${b}) x ${lessonIndex + 2}`;
    answer = itemIndex % 2 === 0 ? String(a + b * (lessonIndex + 2)) : String((a + b) * (lessonIndex + 2));
    hint = "Resolva parênteses e multiplicações antes da soma.";
    explanation = `Use a ordem das operações para chegar a ${answer}.`;
  } else if (kind === 6) {
    const numerator = (itemIndex % 3) + 1;
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
    const base = 40 + itemIndex * 10;
    const percent = [10, 25, 50, 20][lessonIndex];
    question = `Quanto é ${percent}% de ${base}?`;
    answer = String((base * percent) / 100);
    hint = "Transforme a porcentagem em parte de 100.";
    explanation = `${percent}% de ${base} é ${answer}.`;
  } else if (kind === 9) {
    question = `Em uma sala há ${lessonIndex + 4} fileiras com ${itemIndex + 3} carteiras. Quantas carteiras há?`;
    answer = String((lessonIndex + 4) * (itemIndex + 3));
    hint = "Há grupos iguais, então a multiplicação ajuda.";
    explanation = `${lessonIndex + 4} x ${itemIndex + 3} = ${answer}.`;
  } else {
    question = itemIndex % 2 === 0 ? `${a} + ${b} - ${lessonIndex + 1}` : `${a} x ${lessonIndex + 2}`;
    answer = itemIndex % 2 === 0 ? String(a + b - lessonIndex - 1) : String(a * (lessonIndex + 2));
    hint = "Resolva uma operação por vez.";
    explanation = `Calculando com calma, chegamos a ${answer}.`;
  }

  if (type === "true_false") {
    question = `${question} é igual a ${answer}.`;
    answer = "true";
  }

  return { type, question, answer, hint, explanation, difficulty: Math.min(5, 1 + Math.floor(itemIndex / 5)) };
}

const lines = [
  "-- Seed gerado automaticamente para Matemática Quest.",
  "begin;",
];

moduleTitles.forEach(([title, lessonTitles], moduleIndex) => {
  const moduleId = uuid(1000 + moduleIndex);
  lines.push(`insert into public.modules (id,title,description,order_index,icon,color,required_xp,is_active) values (${q(moduleId)},${q(title)},${q(`Módulo de ${title.toLowerCase()} para o 7º ano.`)},${moduleIndex + 1},${q(icons[moduleIndex])},${q(colors[moduleIndex])},${moduleIndex * 80},true) on conflict (id) do update set title = excluded.title;`);
  lessonTitles.forEach((lessonTitle, lessonIndex) => {
    const lessonId = uuid(2000 + moduleIndex * 10 + lessonIndex);
    const skillId = uuid(3000 + moduleIndex * 10 + lessonIndex);
    lines.push(`insert into public.skills (id,name,description,school_year) values (${q(skillId)},${q(lessonTitle)},${q(`Habilidade: ${lessonTitle}.`)},7) on conflict (id) do update set name = excluded.name;`);
    lines.push(`insert into public.lessons (id,module_id,title,description,explanation,example,order_index,xp_bonus,is_active) values (${q(lessonId)},${q(moduleId)},${q(lessonTitle)},${q("Treino guiado com dica e feedback imediato.")},${q("Resolva uma parte por vez e confira seu raciocínio.")},${q("Exemplo resolvido aparece antes da prática.")},${lessonIndex + 1},20,true) on conflict (id) do update set title = excluded.title;`);

    const count = moduleIndex < 4 ? 20 : 10;
    for (let itemIndex = 1; itemIndex <= count; itemIndex += 1) {
      const ex = makeExercise(moduleIndex, lessonIndex, itemIndex);
      const exerciseId = uuid(4000 + moduleIndex * 1000 + lessonIndex * 100 + itemIndex);
      lines.push(`insert into public.exercises (id,lesson_id,skill_id,type,question,correct_answer,explanation,hint,difficulty,school_year,tags,order_index,is_active) values (${q(exerciseId)},${q(lessonId)},${q(skillId)},${q(ex.type)},${q(ex.question)},${q(ex.answer)},${q(ex.explanation)},${q(ex.hint)},${ex.difficulty},7,${arr([title.toLowerCase(), lessonTitle.toLowerCase()])},${itemIndex},true) on conflict (id) do update set question = excluded.question, correct_answer = excluded.correct_answer;`);
      if (ex.type === "multiple_choice") {
        const numeric = Number(String(ex.answer).replace(",", "."));
        const options = Number.isFinite(numeric)
          ? [String(numeric - 2), String(numeric), String(numeric + 3), String(numeric + 7)]
          : [ex.answer, "1/2", "2/3", "3/4"];
        options.forEach((option, optionIndex) => {
          lines.push(`insert into public.exercise_options (id,exercise_id,option_text,is_correct,order_index) values (${q(uuid(8000 + moduleIndex * 4000 + lessonIndex * 400 + itemIndex * 10 + optionIndex))},${q(exerciseId)},${q(option)},${option === ex.answer},${optionIndex + 1}) on conflict (id) do update set option_text = excluded.option_text, is_correct = excluded.is_correct;`);
        });
      }
    }
  });
});

lines.push("commit;");

const outputPath = join(process.cwd(), "supabase", "generated-seed.sql");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Seed gerado em ${outputPath} com 10 módulos, 40 lições e 560 exercícios.`);
