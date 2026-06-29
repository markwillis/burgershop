-- Run this in Supabase SQL Editor to add menu_items table and session delete
-- (Only needed if you already ran the original schema)

-- Menu Items table
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

alter table menu_items enable row level security;

create policy "Anyone can create menu items"
  on menu_items for insert to anon with check (true);

create policy "Anyone can read menu items"
  on menu_items for select to anon using (true);

create policy "Anyone can update menu items"
  on menu_items for update to anon using (true);

create policy "Anyone can delete menu items"
  on menu_items for delete to anon using (true);

-- Allow deleting sessions (for cleanup from home screen)
create policy "Anyone can delete sessions"
  on game_sessions for delete to anon using (true);

-- Enable Realtime for menu items
alter publication supabase_realtime add table menu_items;
