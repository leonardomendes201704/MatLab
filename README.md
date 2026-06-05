# Matemática Quest

Aplicativo de reforço matemático gamificado para alunos do 7º ano, com trilhas, fases, XP, streak, revisão inteligente, painel do responsável e painel administrativo.

## Stack

- Next.js com TypeScript e App Router
- TailwindCSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Row Level Security
- Route Handlers, Server Actions, services e repositories
- Deploy compatível com Vercel

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Copie `Project URL` e `anon public key` para `.env.local`.
3. Copie a `service_role key` para `.env.local`.
4. No SQL Editor, execute `supabase/schema.sql`.
5. Gere a base inicial:

```bash
npm run generate:seed
```

6. Execute `supabase/generated-seed.sql` no SQL Editor.

O arquivo `supabase/seed.sql` funciona como ponte/documentação do seed principal. O arquivo gerado contém 10 módulos, 40 lições e 560 exercícios.

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Rotas

- `/` landing page
- `/login` login
- `/register` cadastro
- `/onboarding` configuração inicial
- `/app` dashboard do aluno
- `/app/trilha` trilha
- `/app/modulo/[moduleId]` lições do módulo
- `/app/licao/[lessonId]` tela de exercício
- `/app/revisao` revisão inteligente
- `/responsavel` painel do responsável
- `/admin` dashboard administrativo
- `/admin/alunos`, `/admin/responsaveis`, `/admin/modulos`, `/admin/licoes`, `/admin/exercicios`, `/admin/relatorios`

## Endpoints

- `POST /api/attempts`
- `GET /api/student/progress`
- `GET /api/student/review`
- `GET /api/admin/students`
- `GET /api/admin/students/[studentId]`
- `GET /api/admin/students/[studentId]/progress`
- `GET /api/admin/exercises`
- `POST /api/admin/exercises`
- `PUT /api/admin/exercises/[exerciseId]`
- `DELETE /api/admin/exercises/[exerciseId]`
- `GET|POST /api/admin/modules`
- `PUT /api/admin/modules/[moduleId]`
- `GET|POST /api/admin/lessons`
- `PUT /api/admin/lessons/[lessonId]`

## Criar usuário admin

1. Cadastre um usuário em `/register`.
2. No Supabase SQL Editor, rode:

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DO_USUARIO';
```

Depois acesse `/admin`.

## Deploy na Vercel

1. Suba o repositório para GitHub.
2. Importe na Vercel.
3. Configure as variáveis de ambiente.
4. Execute `supabase/schema.sql` e `supabase/generated-seed.sql` no Supabase.
5. Faça o deploy.

## WebView mobile e Capacitor

O app é mobile-first e usa navegação inferior na área do aluno, botões grandes e telas responsivas. Para empacotar futuramente:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init matematica-quest com.matematicaquest.app
```

Depois configure o domínio de produção da Vercel como origem da WebView ou avance para exportação nativa conforme a estratégia escolhida.

## Observações de arquitetura

- O frontend não calcula XP de forma confiável; `POST /api/attempts` valida a resposta e calcula XP no backend.
- Exercícios e alunos devem ser desativados com `is_active = false`, não apagados fisicamente.
- A função SQL `increment_learning_progress` atualiza progresso, estatísticas, streak e eventos de XP.
- RLS protege dados por usuário e libera gestão para perfis `admin`.
