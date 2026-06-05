import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return <AppShell><h1 className="mb-5 text-3xl font-black">Perfil</h1><Card><p className="font-bold">Aluno ativo • Meta diária: 10 exercícios • Preferência: revisão geral</p></Card></AppShell>;
}
