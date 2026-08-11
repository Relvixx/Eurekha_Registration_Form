-- 20230811120000_init.sql

-- Table: registrations
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  reference_code text unique,
  participant_type text not null check (participant_type in ('student', 'startup')),
  team_name text not null,
  idea_name text,
  startup_name text,
  problem_statement text not null,
  solution_description text not null,
  short_description text not null,
  category text not null,
  current_stage text not null,
  website_url text,
  linkedin_url text,
  nec_referral_code text not null,
  eureka_registration_id text,
  status text not null default 'DRAFT' check (status in ('DRAFT','EUREKA_PENDING','EUREKA_PROOF_PENDING','EUREKA_PROOF_SUBMITTED','SUBMITTED')),
  current_step smallint not null default 1 check (current_step between 1 and 6),
  eureka_link_clicked boolean not null default false,
  eureka_self_confirmed boolean not null default false,
  final_confirmation boolean not null default false,
  draft_token_hash text unique,
  draft_expires_at timestamptz,
  last_saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz
);

-- Table: team_members
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  full_name text not null,
  email text not null,
  mobile_number text,
  institution text not null,
  role text not null,
  custom_role text,
  is_leader boolean not null default false,
  member_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (registration_id, member_order)
);

-- Table: registration_proofs
create table public.registration_proofs (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  storage_bucket text not null default 'eureka-proofs',
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  uploaded_at timestamptz not null default now(),
  unique (registration_id)
);

-- Table: registration_events
create table public.registration_events (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;
alter table public.registration_proofs enable row level security;
alter table public.registration_events enable row level security;

-- Policies allowing only service_role to access all tables
create policy "service_role_all" on public.registrations for all using (auth.role() = 'service_role');
create policy "service_role_all" on public.team_members for all using (auth.role() = 'service_role');
create policy "service_role_all" on public.registration_proofs for all using (auth.role() = 'service_role');
create policy "service_role_all" on public.registration_events for all using (auth.role() = 'service_role');
