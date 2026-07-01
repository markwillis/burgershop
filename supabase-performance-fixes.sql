-- Burger Game: Performance fixes
-- Run this in the Supabase SQL Editor after the base schema.
-- Adds indexes flagged by the Supabase Postgres best-practices skill:
-- foreign key columns and frequently-filtered columns are not indexed
-- automatically by Postgres.

create index if not exists orders_session_id_idx on orders (session_id);
create index if not exists menu_items_session_id_idx on menu_items (session_id);
create index if not exists game_sessions_code_idx on game_sessions (code);
