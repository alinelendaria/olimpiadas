-- ============================================================
-- Olimpíadas TDJ Haxball — Supabase Schema
-- ============================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ─── Countries / Delegations ─────────────────────────────────────────────────
create table countries (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  code         text not null unique,
  flag_emoji   text not null,
  flag_url     text,
  color_primary   text,
  color_secondary text,
  created_at   timestamptz default now()
);

-- ─── Players ─────────────────────────────────────────────────────────────────
create table players (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  country_id    uuid references countries(id),
  wins          integer default 0,
  losses        integer default 0,
  mvp_count     integer default 0,
  gold_medals   integer default 0,
  silver_medals integer default 0,
  bronze_medals integer default 0,
  created_at    timestamptz default now()
);

-- ─── Events (Modalities) ─────────────────────────────────────────────────────
create table events (
  id                   uuid primary key default uuid_generate_v4(),
  name                 text not null,
  type                 text not null,   -- x1 | x2 | x3 | traditional | shootout | king | special
  description          text,
  icon                 text,
  status               text default 'scheduled',  -- scheduled | ongoing | finished
  format               text,                       -- knockout | groups | round-robin
  max_per_delegation   integer,
  champion_country_id  uuid references countries(id),
  created_at           timestamptz default now()
);

-- ─── Matches ─────────────────────────────────────────────────────────────────
create table matches (
  id            uuid primary key default uuid_generate_v4(),
  event_id      uuid references events(id),
  country_a_id  uuid references countries(id),
  country_b_id  uuid references countries(id),
  player_a_id   uuid references players(id),
  player_b_id   uuid references players(id),
  score_a       integer default 0,
  score_b       integer default 0,
  status        text default 'scheduled',   -- scheduled | live | finished
  mvp_player_id uuid references players(id),
  replay_url    text,
  scheduled_at  timestamptz,
  finished_at   timestamptz,
  created_at    timestamptz default now()
);

-- ─── Medals ──────────────────────────────────────────────────────────────────
create table medals (
  id          uuid primary key default uuid_generate_v4(),
  country_id  uuid references countries(id) not null,
  player_id   uuid references players(id),
  event_id    uuid references events(id),
  type        text not null,   -- gold | silver | bronze
  awarded_at  timestamptz default now()
);

-- ─── Achievements ────────────────────────────────────────────────────────────
create table achievements (
  id          uuid primary key default uuid_generate_v4(),
  player_id   uuid references players(id) not null,
  title       text not null,
  description text,
  icon        text,
  earned_at   timestamptz default now()
);

-- ─── Country Rankings View ───────────────────────────────────────────────────
create or replace view country_rankings as
select
  c.id,
  c.name,
  c.code,
  c.flag_emoji,
  count(m.id) filter (where m.type = 'gold')   as gold,
  count(m.id) filter (where m.type = 'silver') as silver,
  count(m.id) filter (where m.type = 'bronze') as bronze,
  count(m.id)                                   as total,
  (
    count(m.id) filter (where m.type = 'gold')   * 3 +
    count(m.id) filter (where m.type = 'silver') * 2 +
    count(m.id) filter (where m.type = 'bronze') * 1
  ) as points
from countries c
left join medals m on m.country_id = c.id
group by c.id, c.name, c.code, c.flag_emoji
order by gold desc, silver desc, bronze desc;

-- ─── Player Rankings View ────────────────────────────────────────────────────
create or replace view player_rankings as
select
  p.id,
  p.name,
  p.country_id,
  c.flag_emoji,
  c.name as country_name,
  p.wins,
  p.losses,
  p.mvp_count,
  p.gold_medals,
  p.silver_medals,
  p.bronze_medals,
  (p.wins + p.losses) as total_matches,
  case
    when (p.wins + p.losses) = 0 then 0
    else round(p.wins::numeric / (p.wins + p.losses) * 100, 1)
  end as win_rate
from players p
join countries c on c.id = p.country_id
order by p.gold_medals desc, p.silver_medals desc, p.bronze_medals desc, p.wins desc;

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table countries     enable row level security;
alter table players       enable row level security;
alter table events        enable row level security;
alter table matches       enable row level security;
alter table medals        enable row level security;
alter table achievements  enable row level security;

-- Public read policies
create policy "Public read countries"     on countries     for select using (true);
create policy "Public read players"       on players       for select using (true);
create policy "Public read events"        on events        for select using (true);
create policy "Public read matches"       on matches       for select using (true);
create policy "Public read medals"        on medals        for select using (true);
create policy "Public read achievements"  on achievements  for select using (true);

-- Service role write policies (for admin operations via service role key)
create policy "Service role insert countries"     on countries     for insert with check (true);
create policy "Service role update countries"     on countries     for update using (true);
create policy "Service role insert players"       on players       for insert with check (true);
create policy "Service role update players"       on players       for update using (true);
create policy "Service role insert events"        on events        for insert with check (true);
create policy "Service role update events"        on events        for update using (true);
create policy "Service role insert matches"       on matches       for insert with check (true);
create policy "Service role update matches"       on matches       for update using (true);
create policy "Service role insert medals"        on medals        for insert with check (true);
create policy "Service role insert achievements"  on achievements  for insert with check (true);
