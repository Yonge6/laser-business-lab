create extension if not exists pgcrypto;

create table if not exists public.sessions (
  id text primary key,
  visitor_id text not null,
  first_source text,
  first_medium text,
  first_campaign text,
  first_content text,
  last_source text,
  last_medium text,
  last_campaign text,
  last_content text,
  landing_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text references public.sessions(id) on delete set null,
  visitor_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.calculator_results (
  id uuid primary key default gen_random_uuid(),
  session_id text references public.sessions(id) on delete set null,
  calculator_type text not null,
  input_json jsonb not null default '{}'::jsonb,
  result_json jsonb not null default '{}'::jsonb,
  recommended_machine text,
  created_at timestamptz not null default now()
);

create table if not exists public.machine_finder_results (
  id uuid primary key default gen_random_uuid(),
  session_id text references public.sessions(id) on delete set null,
  finder_type text not null default 'machine_finder',
  answer_json jsonb not null default '{}'::jsonb,
  result_json jsonb not null default '{}'::jsonb,
  recommended_machine text,
  created_at timestamptz not null default now()
);

create table if not exists public.outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  session_id text references public.sessions(id) on delete set null,
  visitor_id text,
  machine text not null,
  destination text not null,
  source text,
  medium text,
  campaign text,
  content text,
  tool text,
  tool_result text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id text references public.sessions(id) on delete set null,
  visitor_id text,
  email text not null,
  source_tool text,
  result text,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.machines (
  id text primary key,
  name text not null,
  category text not null,
  price numeric,
  url text not null,
  image text,
  materials text[] not null default '{}',
  use_cases text[] not null default '{}',
  strengths text[] not null default '{}',
  production_level integer not null default 1,
  budget_tier integer not null default 1,
  tags text[] not null default '{}',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists analytics_events_session_idx on public.analytics_events(session_id, created_at desc);
create index if not exists calculator_results_session_idx on public.calculator_results(session_id, created_at desc);
create index if not exists machine_finder_results_session_idx on public.machine_finder_results(session_id, created_at desc);
create index if not exists outbound_clicks_session_idx on public.outbound_clicks(session_id, created_at desc);
create index if not exists leads_email_idx on public.leads(email);

alter table public.sessions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.calculator_results enable row level security;
alter table public.machine_finder_results enable row level security;
alter table public.outbound_clicks enable row level security;
alter table public.leads enable row level security;
alter table public.machines enable row level security;

-- No anonymous policies are created. Next.js route handlers write with the
-- server-only service role key. Add read policies only for a future admin UI.
