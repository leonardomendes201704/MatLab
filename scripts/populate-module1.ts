import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

type LessonSpec = {
  orderIndex: number;
  title: string;
  description: string;
  explanation: string;
  example: string;
};

type GeneratedExercise = {
  type: "multiple_choice" | "input" | "true_false";
  question: string;
  correct_answer: string;
  explanation: string;
  hint: string;
  difficulty: number;
  tags: string[];
  options?: Array<{ option_text: string; is_correct: boolean; order_index: number }>;
};

const lessonSpecs: LessonSpec[] = [
  {
    orderIndex: 1,
    title: "Adição simples",
    description: "Treino inicial com somas curtas e leitura direta.",
    explanation: "Some com calma, primeiro as unidades e depois as dezenas.",
    example: "Exemplo: 12 + 7 = 19.",
  },
  {
    orderIndex: 2,
    title: "Adição com reagrupamento",
    description: "Treino com troca de dez unidades por uma dezena.",
    explanation: "Quando passar de 9 nas unidades, faça o reagrupamento.",
    example: "Exemplo: 18 + 7 = 25.",
  },
  {
    orderIndex: 3,
    title: "Adição com números maiores",
    description: "Somas com números de três algarismos e mais contexto.",
    explanation: "Organize centenas, dezenas e unidades antes de calcular.",
    example: "Exemplo: 125 + 84 = 209.",
  },
  {
    orderIndex: 4,
    title: "Problemas de adição",
    description: "Enunciados curtos para transformar texto em conta.",
    explanation: "Leia o problema e descubra o que precisa ser somado.",
    example: "Exemplo: 3 balas + 4 balas = 7 balas.",
  },
  {
    orderIndex: 5,
    title: "Adição com dezenas",
    description: "Somas de dezenas para ganhar velocidade mental.",
    explanation: "Repare que 10, 20, 30 e 40 ficam mais fáceis de somar.",
    example: "Exemplo: 30 + 40 = 70.",
  },
  {
    orderIndex: 6,
    title: "Adição com centenas",
    description: "Treino com centenas para reforçar valor posicional.",
    explanation: "Some centenas com centenas e mantenha o raciocínio organizado.",
    example: "Exemplo: 200 + 300 = 500.",
  },
  {
    orderIndex: 7,
    title: "Adição com três parcelas",
    description: "Somas com três números para praticar agrupamento.",
    explanation: "Junte duas parcelas primeiro e depois some a terceira.",
    example: "Exemplo: 10 + 20 + 5 = 35.",
  },
  {
    orderIndex: 8,
    title: "Adição com dinheiro",
    description: "Somas com valores simples para usar no dia a dia.",
    explanation: "Leia os valores como quantias e some os totais.",
    example: "Exemplo: R$ 12 + R$ 8 = R$ 20.",
  },
  {
    orderIndex: 9,
    title: "Adição mental",
    description: "Desafios rápidos para calcular de cabeça.",
    explanation: "Procure combinações que somam 10, 20 ou 100.",
    example: "Exemplo: 25 + 15 = 40.",
  },
  {
    orderIndex: 10,
    title: "Revisão de adição",
    description: "Mistura de formatos para revisar tudo o que foi visto.",
    explanation: "Use o tipo de conta que fizer mais sentido para cada questão.",
    example: "Exemplo: escolha o caminho mais rápido para responder.",
  },
];

const moduleOrderIndex = 1;

function uuidFromString(value: string) {
  const hex = createHash("sha1").update(value).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function parseCurrency(value: number) {
  return `R$ ${value}`;
}

function makeMultipleChoiceOptions(answer: number) {
  const candidates = [answer - 5, answer - 2, answer + 3, answer + 7].map((value) => Math.max(0, value));
  const unique = [answer, ...candidates.filter((value) => value !== answer)];
  return unique.slice(0, 4).map((value, index) => ({
    option_text: String(value),
    is_correct: value === answer,
    order_index: index + 1,
  }));
}

function buildExercise(lessonOrder: number, exerciseOrder: number): GeneratedExercise {
  const type: GeneratedExercise["type"] =
    exerciseOrder % 5 === 0 ? "true_false" : exerciseOrder % 2 === 0 ? "input" : "multiple_choice";

  let answer = 0;
  let question = "";
  let explanation = "";
  let hint = "";

  switch (lessonOrder) {
    case 1: {
      const a = 5 + (exerciseOrder % 10);
      const b = 3 + (exerciseOrder % 7);
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Some as unidades com calma.";
      break;
    }
    case 2: {
      const a = 18 + lessonOrder + exerciseOrder;
      const b = 7 + (exerciseOrder % 8);
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Quando passar de 9, leve uma dezena.";
      break;
    }
    case 3: {
      const a = 120 + lessonOrder * 10 + exerciseOrder;
      const b = 40 + exerciseOrder * 2;
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `Somando centenas, dezenas e unidades, chegamos a ${answer}.`;
      hint = "Separe centenas, dezenas e unidades.";
      break;
    }
    case 4: {
      const a = 4 + exerciseOrder;
      const b = 3 + lessonOrder;
      answer = a + b;
      question = `Lumi tinha ${a} figurinhas e ganhou mais ${b}. Com quantas ficou?`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Transforme a história em uma soma.";
      break;
    }
    case 5: {
      const a = (2 + (exerciseOrder % 7)) * 10;
      const b = (3 + (exerciseOrder % 6)) * 10;
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Some dezenas com dezenas.";
      break;
    }
    case 6: {
      const a = (1 + (exerciseOrder % 5)) * 100;
      const b = (2 + (exerciseOrder % 4)) * 100;
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Centenas se somam direto.";
      break;
    }
    case 7: {
      const a = 10 + exerciseOrder;
      const b = 5 + exerciseOrder;
      const c = 2 + (exerciseOrder % 6);
      answer = a + b + c;
      question = `${a} + ${b} + ${c}`;
      explanation = `Somando em partes, chegamos a ${answer}.`;
      hint = "Junte duas parcelas antes da terceira.";
      break;
    }
    case 8: {
      const a = 10 + exerciseOrder;
      const b = 5 + (exerciseOrder % 10);
      answer = a + b;
      question = `${parseCurrency(a)} + ${parseCurrency(b)}`;
      explanation = `${parseCurrency(a)} + ${parseCurrency(b)} = ${parseCurrency(answer)}.`;
      hint = "Leia os valores como quantias e some os totais.";
      break;
    }
    case 9: {
      const a = 20 + exerciseOrder;
      const b = 10 + (exerciseOrder % 9);
      answer = a + b;
      question = `${a} + ${b}`;
      explanation = `${a} + ${b} = ${answer}.`;
      hint = "Procure um caminho rápido para chegar ao resultado.";
      break;
    }
    default: {
      const style = exerciseOrder % 3;
      if (style === 0) {
        const a = 15 + exerciseOrder;
        const b = 6 + (exerciseOrder % 8);
        const c = 4 + (exerciseOrder % 5);
        answer = a + b + c;
        question = `${a} + ${b} + ${c}`;
        explanation = `Na revisão, a soma fica ${answer}.`;
        hint = "Olhe a conta inteira antes de responder.";
      } else if (style === 1) {
        const a = 30 + exerciseOrder * 2;
        const b = 10 + (exerciseOrder % 7);
        answer = a + b;
        question = `${a} + ${b}`;
        explanation = `${a} + ${b} = ${answer}.`;
        hint = "Some primeiro os valores maiores.";
      } else {
        const a = 5 + exerciseOrder;
        const b = 4 + lessonOrder;
        answer = a + b;
        question = `Ana tinha ${a} moedas e ganhou mais ${b}. Quantas moedas ficou?`;
        explanation = `${a} + ${b} = ${answer}.`;
        hint = "Converta o texto em uma soma simples.";
      }
      break;
    }
  }

  if (type === "true_false") {
    const isTrue = exerciseOrder % 2 === 1;
    const displayAnswer = isTrue ? answer : answer + 1;
    question = `${question} = ${displayAnswer}.`;
    return {
      type,
      question,
      correct_answer: isTrue ? "true" : "false",
      explanation,
      hint,
      difficulty: Math.min(5, 1 + Math.floor((exerciseOrder - 1) / 5)),
      tags: ["adição", `lição-${lessonOrder}`],
    };
  }

  const result = String(answer);
  return {
    type,
    question,
    correct_answer: result,
    explanation,
    hint,
    difficulty: Math.min(5, 1 + Math.floor((exerciseOrder - 1) / 5)),
    tags: ["adição", `lição-${lessonOrder}`],
    options: type === "multiple_choice" ? makeMultipleChoiceOptions(answer) : undefined,
  };
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de executar.");
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: moduleRow, error: moduleError } = await supabase
    .from("modules")
    .select("id,title,order_index")
    .eq("order_index", moduleOrderIndex)
    .maybeSingle();

  if (moduleError) {
    throw moduleError;
  }

  if (!moduleRow?.id) {
    throw new Error("Não encontrei o módulo 1 no banco de dados.");
  }

  for (const lessonSpec of lessonSpecs) {
    const { data: existingLesson, error: lessonError } = await supabase
      .from("lessons")
      .select("id, title")
      .eq("module_id", moduleRow.id)
      .eq("order_index", lessonSpec.orderIndex)
      .maybeSingle();

    if (lessonError) {
      throw lessonError;
    }

    const lessonId = existingLesson?.id ?? uuidFromString(`module-1-lesson-${lessonSpec.orderIndex}`);
    const lessonPayload = {
      id: lessonId,
      module_id: moduleRow.id,
      title: lessonSpec.title,
      description: lessonSpec.description,
      explanation: lessonSpec.explanation,
      example: lessonSpec.example,
      order_index: lessonSpec.orderIndex,
      xp_bonus: 20,
      is_active: true,
    };

    const { error: lessonUpsertError } = existingLesson
      ? await supabase.from("lessons").update(lessonPayload).eq("id", lessonId)
      : await supabase.from("lessons").insert(lessonPayload);

    if (lessonUpsertError) {
      throw lessonUpsertError;
    }

    const { data: existingExercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("order_index")
      .eq("lesson_id", lessonId);

    if (exercisesError) {
      throw exercisesError;
    }

    const existingOrderIndexes = new Set((existingExercises ?? []).map((exercise) => exercise.order_index));

    for (let exerciseOrder = 1; exerciseOrder <= 20; exerciseOrder += 1) {
      if (existingOrderIndexes.has(exerciseOrder)) continue;

      const exercise = buildExercise(lessonSpec.orderIndex, exerciseOrder);
      const exerciseId = uuidFromString(`module-1-lesson-${lessonSpec.orderIndex}-exercise-${exerciseOrder}`);

      const { error: exerciseError } = await supabase.from("exercises").insert({
        id: exerciseId,
        lesson_id: lessonId,
        skill_id: null,
        type: exercise.type,
        question: exercise.question,
        correct_answer: exercise.correct_answer,
        explanation: exercise.explanation,
        hint: exercise.hint,
        difficulty: exercise.difficulty,
        school_year: 7,
        tags: exercise.tags,
        order_index: exerciseOrder,
        is_active: true,
      });

      if (exerciseError) {
        throw exerciseError;
      }

      if (exercise.options?.length) {
        const optionRows = exercise.options.map((option) => ({
          id: uuidFromString(`module-1-lesson-${lessonSpec.orderIndex}-exercise-${exerciseOrder}-option-${option.order_index}`),
          exercise_id: exerciseId,
          option_text: option.option_text,
          is_correct: option.is_correct,
          order_index: option.order_index,
        }));

        const { error: optionError } = await supabase.from("exercise_options").insert(optionRows);
        if (optionError) {
          throw optionError;
        }
      }
    }
  }

  console.log("Módulo 1 atualizado com 10 lições e 200 exercícios.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
