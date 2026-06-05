create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  nickname text,
  role text not null default 'student' check (role in ('student','guardian','admin')),
  daily_goal int default 10,
  initial_level text,
  preferred_training text,
  total_xp int default 0,
  current_streak int default 0,
  best_streak int default 0,
  last_activity_date date,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.guardian_students (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid references public.profiles(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp default now(),
  unique (guardian_id, student_id)
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index int not null,
  icon text,
  color text,
  required_xp int default 0,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade,
  title text not null,
  description text,
  explanation text,
  example text,
  order_index int not null,
  xp_bonus int default 20,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  school_year int default 7,
  created_at timestamp default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  skill_id uuid references public.skills(id),
  type text not null check (type in ('multiple_choice','input','true_false','complete','word_problem','ordering','matching')),
  question text not null,
  correct_answer text not null,
  explanation text,
  hint text,
  difficulty int default 1,
  school_year int default 7,
  tags text[],
  order_index int default 0,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.exercise_options (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid references public.exercises(id) on delete cascade,
  option_text text not null,
  is_correct boolean default false,
  order_index int default 0
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  answer text,
  is_correct boolean not null,
  used_hint boolean default false,
  attempt_number int default 1,
  xp_earned int default 0,
  time_spent_seconds int default 0,
  created_at timestamp default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed boolean default false,
  score int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  total_attempts int default 0,
  xp_earned int default 0,
  started_at timestamp default now(),
  completed_at timestamp,
  updated_at timestamp default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  unlocked boolean default false,
  completed boolean default false,
  progress_percent numeric default 0,
  completed_at timestamp,
  updated_at timestamp default now(),
  unique (user_id, module_id)
);

create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  activity_date date not null,
  exercises_done int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  xp_earned int default 0,
  goal_completed boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  unique (user_id, activity_date)
);

create table if not exists public.skill_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  attempts_count int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  mastery_level numeric default 0,
  needs_review boolean default false,
  updated_at timestamp default now(),
  unique (user_id, skill_id)
);

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount int not null,
  reason text not null,
  created_at timestamp default now()
);

create table if not exists public.exercise_stats (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid references public.exercises(id) on delete cascade,
  attempts_count int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  avg_time_seconds numeric default 0,
  updated_at timestamp default now(),
  unique (exercise_id)
);

create index if not exists idx_attempts_user_id on public.attempts(user_id);
create index if not exists idx_attempts_exercise_id on public.attempts(exercise_id);
create index if not exists idx_attempts_created_at on public.attempts(created_at);
create index if not exists idx_lesson_progress_user_id on public.lesson_progress(user_id);
create index if not exists idx_module_progress_user_id on public.module_progress(user_id);
create index if not exists idx_skill_stats_user_id on public.skill_stats(user_id);
create index if not exists idx_exercises_lesson_id on public.exercises(lesson_id);
create index if not exists idx_exercises_skill_id on public.exercises(skill_id);
create index if not exists idx_exercises_is_active on public.exercises(is_active);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and is_active = true);
$$;

create or replace function public.increment_learning_progress(
  p_user_id uuid,
  p_lesson_id uuid,
  p_exercise_id uuid,
  p_skill_id uuid,
  p_is_correct boolean,
  p_xp_earned int,
  p_time_spent_seconds int,
  p_activity_date date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into lesson_progress (user_id, lesson_id, correct_count, wrong_count, total_attempts, xp_earned, updated_at)
  values (p_user_id, p_lesson_id, case when p_is_correct then 1 else 0 end, case when p_is_correct then 0 else 1 end, 1, p_xp_earned, now())
  on conflict (user_id, lesson_id) do update set
    correct_count = lesson_progress.correct_count + case when p_is_correct then 1 else 0 end,
    wrong_count = lesson_progress.wrong_count + case when p_is_correct then 0 else 1 end,
    total_attempts = lesson_progress.total_attempts + 1,
    xp_earned = lesson_progress.xp_earned + p_xp_earned,
    score = greatest(0, round(((lesson_progress.correct_count + case when p_is_correct then 1 else 0 end)::numeric / greatest(lesson_progress.total_attempts + 1, 1)) * 100)),
    updated_at = now();

  insert into daily_activity (user_id, activity_date, exercises_done, correct_count, wrong_count, xp_earned, updated_at)
  values (p_user_id, p_activity_date, 1, case when p_is_correct then 1 else 0 end, case when p_is_correct then 0 else 1 end, p_xp_earned, now())
  on conflict (user_id, activity_date) do update set
    exercises_done = daily_activity.exercises_done + 1,
    correct_count = daily_activity.correct_count + case when p_is_correct then 1 else 0 end,
    wrong_count = daily_activity.wrong_count + case when p_is_correct then 0 else 1 end,
    xp_earned = daily_activity.xp_earned + p_xp_earned,
    goal_completed = daily_activity.exercises_done + 1 >= coalesce((select daily_goal from profiles where id = p_user_id), 10),
    updated_at = now();

  if p_skill_id is not null then
    insert into skill_stats (user_id, skill_id, attempts_count, correct_count, wrong_count, mastery_level, needs_review, updated_at)
    values (p_user_id, p_skill_id, 1, case when p_is_correct then 1 else 0 end, case when p_is_correct then 0 else 1 end, case when p_is_correct then 0.2 else 0 end, not p_is_correct, now())
    on conflict (user_id, skill_id) do update set
      attempts_count = skill_stats.attempts_count + 1,
      correct_count = skill_stats.correct_count + case when p_is_correct then 1 else 0 end,
      wrong_count = skill_stats.wrong_count + case when p_is_correct then 0 else 1 end,
      mastery_level = least(1, greatest(0, skill_stats.mastery_level + case when p_is_correct then 0.08 else -0.12 end)),
      needs_review = greatest(0, skill_stats.mastery_level + case when p_is_correct then 0.08 else -0.12 end) < 0.7,
      updated_at = now();
  end if;

  insert into exercise_stats (exercise_id, attempts_count, correct_count, wrong_count, avg_time_seconds, updated_at)
  values (p_exercise_id, 1, case when p_is_correct then 1 else 0 end, case when p_is_correct then 0 else 1 end, p_time_spent_seconds, now())
  on conflict (exercise_id) do update set
    avg_time_seconds = ((exercise_stats.avg_time_seconds * exercise_stats.attempts_count) + p_time_spent_seconds) / greatest(exercise_stats.attempts_count + 1, 1),
    attempts_count = exercise_stats.attempts_count + 1,
    correct_count = exercise_stats.correct_count + case when p_is_correct then 1 else 0 end,
    wrong_count = exercise_stats.wrong_count + case when p_is_correct then 0 else 1 end,
    updated_at = now();

  update profiles
  set total_xp = total_xp + p_xp_earned,
      last_activity_date = p_activity_date,
      current_streak = case
        when last_activity_date = p_activity_date then current_streak
        when last_activity_date = p_activity_date - 1 then current_streak + 1
        else 1
      end,
      best_streak = greatest(best_streak, case
        when last_activity_date = p_activity_date then current_streak
        when last_activity_date = p_activity_date - 1 then current_streak + 1
        else 1
      end),
      updated_at = now()
  where id = p_user_id;

  if p_xp_earned > 0 then
    insert into xp_events (user_id, amount, reason) values (p_user_id, p_xp_earned, 'attempt_correct');
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.guardian_students enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.skills enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_options enable row level security;
alter table public.attempts enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.module_progress enable row level security;
alter table public.daily_activity enable row level security;
alter table public.skill_stats enable row level security;
alter table public.xp_events enable row level security;
alter table public.exercise_stats enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own_or_admin" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());

create policy "guardian_links_read" on public.guardian_students for select using (guardian_id = auth.uid() or public.is_admin());
create policy "guardian_links_admin_all" on public.guardian_students for all using (public.is_admin()) with check (public.is_admin());

create policy "modules_read_active" on public.modules for select using (is_active = true or public.is_admin());
create policy "modules_admin_all" on public.modules for all using (public.is_admin()) with check (public.is_admin());
create policy "lessons_read_active" on public.lessons for select using (is_active = true or public.is_admin());
create policy "lessons_admin_all" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "skills_read_auth" on public.skills for select using (auth.uid() is not null);
create policy "skills_admin_all" on public.skills for all using (public.is_admin()) with check (public.is_admin());

create policy "exercises_read_active" on public.exercises for select using (is_active = true or public.is_admin());
create policy "exercises_admin_all" on public.exercises for all using (public.is_admin()) with check (public.is_admin());
create policy "exercise_options_read_active" on public.exercise_options for select using (exists (select 1 from public.exercises e where e.id = exercise_id and (e.is_active = true or public.is_admin())));
create policy "exercise_options_admin_all" on public.exercise_options for all using (public.is_admin()) with check (public.is_admin());

create policy "attempts_insert_own" on public.attempts for insert with check (user_id = auth.uid());
create policy "attempts_read_own_or_admin" on public.attempts for select using (user_id = auth.uid() or public.is_admin());

create policy "lesson_progress_read" on public.lesson_progress for select using (user_id = auth.uid() or public.is_admin());
create policy "module_progress_read" on public.module_progress for select using (user_id = auth.uid() or public.is_admin());
create policy "daily_activity_read" on public.daily_activity for select using (user_id = auth.uid() or public.is_admin());
create policy "skill_stats_read" on public.skill_stats for select using (user_id = auth.uid() or public.is_admin());
create policy "xp_events_read" on public.xp_events for select using (user_id = auth.uid() or public.is_admin());
create policy "exercise_stats_admin_read" on public.exercise_stats for select using (public.is_admin());
