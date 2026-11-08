-- Fast POS Menu: initial schema. Not applied anywhere yet.
-- Apply to a NEW Supabase project owned by Code 85 Labs (not any employer account).

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  restaurant_name text not null default '',
  target text not null check (target in ('square', 'clover', 'toast')),
  menu jsonb not null,                -- canonical Menu (src/lib/menu/schema.ts)
  status text not null default 'draft' check (status in ('draft', 'exported')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menus_user_idx on public.menus (user_id, updated_at desc);

-- Every Claude call, for margin tracking.
create table public.extractions (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references public.menus (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  model text not null,
  input_tokens int not null,
  output_tokens int not null,
  cache_read_tokens int not null default 0,
  cost_usd numeric(10, 5) not null,
  file_count int not null,
  item_count int not null,
  created_at timestamptz not null default now()
);

-- Billing (filled by Stripe webhooks; see src/lib/billing/entitlements.ts).
create table public.build_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source text not null check (source in ('per_menu', 'subscription', 'grant')),
  stripe_ref text,
  spent_on_menu uuid references public.menus (id),
  spent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  plan text not null check (plan in ('pro', 'agency')),
  status text not null,
  current_period_end timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.menus enable row level security;
alter table public.extractions enable row level security;
alter table public.build_credits enable row level security;
alter table public.subscriptions enable row level security;

create policy "own menus" on public.menus
  for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "read own extractions" on public.extractions
  for select using ((select auth.uid()) = user_id);
create policy "read own credits" on public.build_credits
  for select using ((select auth.uid()) = user_id);
create policy "read own subscription" on public.subscriptions
  for select using ((select auth.uid()) = user_id);
-- Writes to extractions/credits/subscriptions happen server-side with the service role.

-- Private bucket for uploaded menu files (needed for PDFs > 4 MB: client uploads via signed URL,
-- server reads from storage). Auto-delete after 30 days via a scheduled job.
insert into storage.buckets (id, name, public) values ('menu-uploads', 'menu-uploads', false);
create policy "own uploads" on storage.objects
  for all using (bucket_id = 'menu-uploads' and (select auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'menu-uploads' and (select auth.uid())::text = (storage.foldername(name))[1]);
