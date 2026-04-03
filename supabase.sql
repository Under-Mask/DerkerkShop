-- Run this in Supabase SQL editor.
-- Minimal commerce schema: products + orders.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null, -- our public order id
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  amount integer not null check (amount >= 0),
  currency text not null default 'KRW',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  payment_provider text not null default 'toss',
  payment_key text,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  name text not null,
  price integer not null check (price >= 0),
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read for active products
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
on public.products
for select
using (active = true);

-- Orders are server-only (service role). Keep RLS enabled without public policies.

