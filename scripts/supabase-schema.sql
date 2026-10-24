-- Skema Sentral CCTV di Supabase.
-- Jalankan sekali lewat Management API / SQL Editor. Aman dijalankan ulang (idempotent).

-- ---------------------------------------------------------------- profil admin
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Hanya admin yang boleh membaca/mengubah data toko.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select to authenticated
  using (id = auth.uid());

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Setiap user Auth baru otomatis punya profil. Sign-up publik dimatikan,
-- jadi user hanya dibuat oleh admin lewat dashboard/Admin API.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'admin'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------ data toko
create table if not exists public.categories (
  id text primary key,
  sort_order integer not null default 0,
  name text not null default ''
);

create table if not exists public.products (
  id text primary key,
  sort_order integer not null default 0,
  sku text not null default '',
  name text not null default '',
  cat text not null default '',
  brand text not null default '',
  cost bigint not null default 0,
  price bigint not null default 0,
  price_tech bigint not null default 0,
  stock integer not null default 0,
  min integer not null default 0,
  unit text not null default 'pcs'
);

create table if not exists public.customers (
  id text primary key,
  sort_order integer not null default 0,
  name text not null default '',
  phone text not null default '',
  address text not null default '',
  price_type text not null default 'Pelanggan',
  due_days integer
);

create table if not exists public.suppliers (
  id text primary key,
  sort_order integer not null default 0,
  name text not null default '',
  contact text not null default '',
  phone text not null default '',
  address text not null default '',
  status text not null default 'Aktif'
);

create table if not exists public.purchases (
  id text primary key,
  sort_order integer not null default 0,
  no text not null default '',
  date text not null default '',
  supplier_id text not null default '',
  items jsonb not null default '[]'::jsonb,
  pay text not null default 'Lunas',
  received boolean not null default false
);

create table if not exists public.sales (
  id text primary key,
  sort_order integer not null default 0,
  inv text not null default '',
  date text not null default '',
  due_date text,
  due_days integer,
  cust_id text not null default '',
  cashier text not null default '',
  price_type text not null default 'Pelanggan',
  items jsonb not null default '[]'::jsonb,
  subtotal bigint not null default 0,
  discount bigint not null default 0,
  tax bigint not null default 0,
  total bigint not null default 0,
  method text not null default 'Tunai',
  paid bigint not null default 0,
  change bigint not null default 0,
  status text not null default 'Lunas'
);

create table if not exists public.jobs (
  id text primary key,
  sort_order integer not null default 0,
  no text not null default '',
  cust_id text not null default '',
  address text not null default '',
  type text not null default '',
  schedule text not null default '',
  tech text not null default '',
  status text not null default 'Permintaan Baru',
  service bigint not null default 0,
  transport bigint not null default 0,
  discount bigint not null default 0,
  materials jsonb not null default '[]'::jsonb,
  pay text not null default 'Belum Bayar',
  paid_amount bigint not null default 0,
  notes text not null default '',
  history jsonb not null default '[]'::jsonb
);

create table if not exists public.stock_log (
  id bigint generated always as identity primary key,
  date text not null default '',
  pid text not null default '',
  type text not null default 'Masuk',
  qty integer not null default 0,
  ref text not null default ''
);

create table if not exists public.settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'Sentral CCTV',
  address text not null default '',
  phone text not null default '',
  invoice_prefix text not null default 'INV',
  tax bigint not null default 0,
  max_discount bigint not null default 20,
  default_min integer not null default 5,
  cashier text not null default '',
  paper text not null default '80',
  footer text not null default '',
  due_days integer not null default 14,
  logo text
);

create table if not exists public.counters (
  id smallint primary key default 1 check (id = 1),
  sale integer not null default 1,
  job integer not null default 1,
  pur integer not null default 1
);

-- ------------------------------------------------------------------ RLS admin
do $$
declare t text;
begin
  foreach t in array array['categories','products','customers','suppliers','purchases','sales','jobs','stock_log','settings','counters']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_all', t
    );
  end loop;
end $$;

-- --------------------------------------------------------------------- index
-- Kolom urutan tampilan (ditulis otomatis oleh aplikasi) untuk tabel yang sudah ada.
do $$
declare t text;
begin
  foreach t in array array['categories','products','customers','suppliers','purchases','sales','jobs']
  loop
    execute format('alter table public.%I add column if not exists sort_order integer not null default 0', t);
  end loop;
end $$;

create index if not exists sales_date_idx on public.sales (date desc);
create index if not exists sales_cust_idx on public.sales (cust_id);
create index if not exists jobs_cust_idx on public.jobs (cust_id);
create index if not exists purchases_supplier_idx on public.purchases (supplier_id);
create index if not exists stock_log_pid_idx on public.stock_log (pid);
