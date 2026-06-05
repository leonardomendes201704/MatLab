import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-sky-50 p-4">
      <form className="mx-auto grid max-w-xl gap-4 py-8">
        <h1 className="text-3xl font-black">Vamos preparar seu treino</h1>
        <Card><label className="font-bold">Nome</label><input className="mt-2 w-full rounded-xl border p-3" name="name" /></Card>
        <Card><label className="font-bold">Apelido</label><input className="mt-2 w-full rounded-xl border p-3" name="nickname" /></Card>
        <Card><label className="font-bold">Nível inicial</label><select className="mt-2 w-full rounded-xl border p-3"><option>Tenho muita dificuldade</option><option>Sei um pouco</option><option>Quero revisar</option></select></Card>
        <Card><label className="font-bold">Meta diária</label><select className="mt-2 w-full rounded-xl border p-3"><option>5 exercícios</option><option>10 exercícios</option><option>15 exercícios</option><option>20 exercícios</option></select></Card>
        <Card><label className="font-bold">Preferência de treino</label><select className="mt-2 w-full rounded-xl border p-3"><option>Operações básicas</option><option>Problemas de texto</option><option>Revisão geral</option></select></Card>
        <Button>Começar jornada</Button>
      </form>
    </main>
  );
}
