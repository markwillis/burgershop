-- Burger Game: Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- 1. Game Sessions table
create table if not exists game_sessions (
  id uuid default gen_random_uuid() primary key,
  code text not null,
  name text not null default 'Burger Game',
  created_at timestamptz default now()
);

-- 2. Orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references game_sessions(id) on delete cascade not null,
  order_number int not null,
  items jsonb not null default '[]',
  total numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'cooking', 'ready', 'served')),
  amount_paid numeric(10,2),
  change_due numeric(10,2),
  created_at timestamptz default now()
);

-- 3. Menu Items table (per-session customizable menu)
create table if not exists menu_items (
  id serial primary key,
  session_id uuid references game_sessions(id) on delete cascade not null,
  name text not null,
  description text not null default '',
  emoji text not null default '🍔',
  price numeric(10,2) not null default 0,
  category text not null default 'burgers' check (category in ('burgers', 'sides', 'drinks', 'desserts')),
  created_at timestamptz default now()
);

-- 4. Enable Row Level Security
alter table game_sessions enable row level security;
alter table orders enable row level security;
alter table menu_items enable row level security;

-- 5. Allow anonymous access (for the game - no login required)
create policy "Anyone can create sessions"
  on game_sessions for insert
  to anon
  with check (true);

create policy "Anyone can read sessions"
  on game_sessions for select
  to anon
  using (true);

create policy "Anyone can create orders"
  on orders for insert
  to anon
  with check (true);

create policy "Anyone can read orders"
  on orders for select
  to anon
  using (true);

create policy "Anyone can update orders"
  on orders for update
  to anon
  using (true);

create policy "Anyone can create menu items"
  on menu_items for insert
  to anon
  with check (true);

create policy "Anyone can read menu items"
  on menu_items for select
  to anon
  using (true);

create policy "Anyone can update menu items"
  on menu_items for update
  to anon
  using (true);

create policy "Anyone can delete menu items"
  on menu_items for delete
  to anon
  using (true);

-- 6. Enable Realtime
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table menu_items;
