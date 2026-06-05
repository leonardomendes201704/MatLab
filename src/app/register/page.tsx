"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  async function register(formData: FormData) {
    setMessage("");
    try {
      const supabase = createClient();
      const role = String(formData.get("role"));
      const name = String(formData.get("name"));
      const { data, error } = await supabase.auth.signUp({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        options: { data: { name, role } },
      });
      if (error) setMessage(error.message);
      else {
        if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, name, role });
        window.location.href = role === "student" ? "/onboarding" : role === "guardian" ? "/responsavel" : "/admin";
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Não foi possível cadastrar.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sky-50 p-4">
      <form action={register} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-black">Criar conta</h1>
        <input className="mt-6 w-full rounded-xl border p-3" name="name" placeholder="Nome" required />
        <input className="mt-3 w-full rounded-xl border p-3" name="email" placeholder="Email" type="email" required />
        <input className="mt-3 w-full rounded-xl border p-3" name="password" placeholder="Senha" type="password" required />
        <select className="mt-3 w-full rounded-xl border p-3" name="role" defaultValue="student"><option value="student">Aluno</option><option value="guardian">Responsável</option></select>
        {message ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-800">{message}</p> : null}
        <Button className="mt-5 w-full">Cadastrar</Button>
        <p className="mt-4 text-center text-sm text-slate-600">Já tem conta? <Link className="font-bold text-emerald-700" href="/login">Entrar</Link></p>
      </form>
    </main>
  );
}
