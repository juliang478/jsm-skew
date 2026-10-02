create extension if not exists pgcrypto;

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  listing_url text not null unique,
  parser_strategy text,
  active boolean not null default true,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id) on delete cascade,
  url text not null unique,
  canonical_url text,
  title text not null,
  image_url text not null,
  published_at timestamptz not null,
  raw_text text not null default '',
  scraped_at timestamptz not null default now(),
  analyzed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists articles_source_id_idx on public.articles(source_id);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_analyzed_at_idx on public.articles(analyzed_at);

create table if not exists public.article_analyses (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null unique references public.articles(id) on delete cascade,
  summary text not null,
  sentiment_score numeric(4,3) not null check (sentiment_score >= -1 and sentiment_score <= 1),
  sentiment_label text not null check (sentiment_label in ('positive', 'neutral', 'negative')),
  bias_score numeric(4,3) not null check (bias_score >= -1 and bias_score <= 1),
  bias_label text not null check (bias_label in ('left', 'center', 'right', 'mixed', 'unclear')),
  left_percentage int not null check (left_percentage between 0 and 100),
  center_percentage int not null check (center_percentage between 0 and 100),
  right_percentage int not null check (right_percentage between 0 and 100),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  framing_notes text,
  loaded_terms text[] not null default '{}',
  disclaimer text,
  model text not null,
  created_at timestamptz not null default now(),
  constraint article_analyses_percentages_sum check (left_percentage + center_percentage + right_percentage = 100)
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  level text not null default 'info' check (level in ('debug', 'info', 'warn', 'error')),
  event text not null,
  message text,
  context jsonb,
  source_id uuid references public.sources(id) on delete set null,
  article_id uuid references public.articles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists logs_created_at_idx on public.logs(created_at desc);

create table if not exists public.oxylabs_schedules (
  id uuid primary key default gen_random_uuid(),
  schedule_id text not null unique,
  source_id uuid not null references public.sources(id) on delete cascade,
  cron text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oxylabs_schedule_runs (
  id uuid primary key default gen_random_uuid(),
  schedule_id text not null references public.oxylabs_schedules(schedule_id) on delete cascade,
  run_id text not null,
  job_id text,
  result_status text,
  processed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (schedule_id, run_id, job_id)
);

create index if not exists oxylabs_runs_schedule_idx on public.oxylabs_schedule_runs(schedule_id);

alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.article_analyses enable row level security;
alter table public.logs enable row level security;
alter table public.oxylabs_schedules enable row level security;
alter table public.oxylabs_schedule_runs enable row level security;

revoke all on table
  public.sources,
  public.articles,
  public.article_analyses,
  public.logs,
  public.oxylabs_schedules,
  public.oxylabs_schedule_runs
from anon, authenticated;

grant all on table
  public.sources,
  public.articles,
  public.article_analyses,
  public.logs,
  public.oxylabs_schedules,
  public.oxylabs_schedule_runs
to service_role;