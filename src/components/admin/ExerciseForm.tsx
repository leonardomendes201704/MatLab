"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { lessons } from "@/lib/data/catalog";

export function ExerciseForm() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const optionTexts = ["option_1", "option_2", "option_3", "option_4"]
        .map((name, index) => ({ option_text: String(formData.get(name) ?? "").trim(), is_correct: Number(formData.get("correct_option") ?? 0) === index, order_index: index + 1 }))
        .filter((option) => option.option_text.length > 0);
      const type = String(formData.get("type"));
      const response = await fetch("/api/admin/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: formData.get("lesson_id"),
          type,
          question: formData.get("question"),
          correct_answer: formData.get("correct_answer"),
          hint: formData.get("hint"),
          explanation: formData.get("explanation"),
          difficulty: Number(formData.get("difficulty") ?? 1),
          school_year: 7,
          tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
          order_index: Number(formData.get("order_index") ?? 0),
          is_active: formData.get("is_active") === "on",
          options: type === "multiple_choice" ? optionTexts : [],
        }),
      });
      setMessage(response.ok ? "Exercício salvo com sucesso." : "Revise os campos obrigatórios e tente novamente.");
    });
  }

  return (
    <form action={submit} className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <select className="rounded-xl border border-slate-300 p-3" name="lesson_id" defaultValue={lessons[0].id}>{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select>
      <select className="rounded-xl border border-slate-300 p-3" name="type" defaultValue="multiple_choice"><option value="multiple_choice">Múltipla escolha</option><option value="input">Resposta digitada</option><option value="true_false">Verdadeiro ou falso</option><option value="complete">Completar lacuna</option><option value="word_problem">Problema contextualizado</option><option value="ordering">Ordenação</option><option value="matching">Relacionar itens</option></select>
      <textarea className="min-h-28 rounded-xl border border-slate-300 p-3" name="question" placeholder="Enunciado" required />
      <input className="rounded-xl border border-slate-300 p-3" name="correct_answer" placeholder="Resposta correta" required />
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
        <p className="font-black">Alternativas para múltipla escolha</p>
        {[1, 2, 3, 4].map((item, index) => (
          <label className="grid gap-2 sm:grid-cols-[auto_1fr]" key={item}>
            <input name="correct_option" type="radio" value={index} defaultChecked={index === 0} />
            <input className="rounded-xl border border-slate-300 p-3" name={`option_${item}`} placeholder={`Alternativa ${item}`} />
          </label>
        ))}
      </div>
      <input className="rounded-xl border border-slate-300 p-3" name="hint" placeholder="Dica" />
      <textarea className="rounded-xl border border-slate-300 p-3" name="explanation" placeholder="Explicação curta" />
      <div className="grid gap-3 sm:grid-cols-3">
        <input className="rounded-xl border border-slate-300 p-3" name="difficulty" placeholder="Dificuldade" type="number" min={1} max={5} defaultValue={1} />
        <input className="rounded-xl border border-slate-300 p-3" name="order_index" placeholder="Ordem" type="number" defaultValue={0} />
        <input className="rounded-xl border border-slate-300 p-3" name="tags" placeholder="Tags separadas por vírgula" />
      </div>
      <label className="flex items-center gap-2 font-bold"><input name="is_active" type="checkbox" defaultChecked /> Ativo</label>
      {message ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p> : null}
      <Button disabled={isPending} type="submit">{isPending ? "Salvando..." : "Salvar exercício"}</Button>
    </form>
  );
}
