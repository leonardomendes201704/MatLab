"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function login(formData: FormData) {
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      if (authError) setError(authError.message);
      else window.location.href = "/app";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sky-50 p-4">
      <form action={login} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-black">Entrar</h1>
        <input className="mt-6 w-full rounded-xl border p-3" name="email" placeholder="Email" type="email" required />
        <input className="mt-3 w-full rounded-xl border p-3" name="password" placeholder="Senha" type="password" required />
        {error ? <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
        <Button className="mt-5 w-full">Entrar</Button>
        <p className="mt-4 text-center text-sm text-slate-600">Ainda não tem conta? <Link className="font-bold text-emerald-700" href="/register">Cadastrar</Link></p>
      </form>
    </main>
  );
}
