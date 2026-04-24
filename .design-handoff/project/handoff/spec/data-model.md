# Data Model

Postgres on Supabase. All user-scoped tables have **Row-Level Security** enabled. Migrations live in `supabase/migrations/`.

## Entity relationship

```
hotels ──┐
         ├─→ employees ──┬─→ submissions ──→ feedback
         │               ├─→ streaks
         │               ├─→ stamps
         │               └─→ level_history
         │
         ├─→ scenarios ──→ prompts ──→ audio_assets
         └─→ manager_messages
```

---

## Tables

### `hotels`

```sql
create table hotels (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,           -- 6-char, e.g. "GRANCB"
  name          text not null,
  city          text,
  country       text default 'MX',
  created_at    timestamptz default now(),
  metadata      jsonb default '{}'::jsonb
);
```

**RLS**: read-only for authenticated employees belonging to that hotel; write via service role only.

### `employees`

```sql
create type role_t as enum ('botones', 'recepcion', 'restaurante');
create type cefr_t as enum ('A1', 'A2', 'B1', 'B2');

create table employees (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid references auth.users(id) on delete cascade unique,
  hotel_id        uuid references hotels(id) not null,
  phone           text not null,                -- E.164
  first_name      text,
  last_name       text,
  role            role_t,
  current_level   cefr_t,
  baseline_level  cefr_t,                       -- set by diagnostic, immutable
  onboarded_at    timestamptz,
  last_active_at  timestamptz,
  created_at      timestamptz default now()
);

create index on employees (hotel_id);
create index on employees (auth_user_id);
```

**RLS**:
```sql
-- an employee can read + update only their own row
create policy "self read" on employees for select using (auth.uid() = auth_user_id);
create policy "self update" on employees for update using (auth.uid() = auth_user_id);
```

### `scenarios`

Reusable drill templates, role-specific.

```sql
create type drill_kind_t as enum ('listening', 'speaking', 'mixed');

create table scenarios (
  id              uuid primary key default gen_random_uuid(),
  role            role_t not null,
  target_level    cefr_t not null,
  kind            drill_kind_t not null,
  title_es        text not null,                -- "Ayudando con el equipaje"
  title_en        text not null,                -- "Helping with luggage"
  context_es      text,                         -- scene description shown to user
  transcript_en   text,                         -- full English dialogue
  est_duration_s  int default 180,
  rubric          jsonb not null,               -- see spec/ai-services.md
  created_at      timestamptz default now()
);

create index on scenarios (role, target_level, kind);
```

### `prompts`

A single utterance within a scenario. Listening prompts have audio; speaking prompts have a target transcript.

```sql
create type prompt_kind_t as enum ('listen_mc', 'listen_open', 'speak_prompt', 'speak_freeform');

create table prompts (
  id              uuid primary key default gen_random_uuid(),
  scenario_id     uuid references scenarios(id) on delete cascade,
  order_idx       int not null,
  kind            prompt_kind_t not null,
  text_en         text,                         -- dialogue line (for TTS or reference)
  text_es         text,                         -- Spanish scene setter
  options         jsonb,                        -- for MC: [{id, text_es, is_correct}]
  target_phrase   text,                         -- for speak_prompt: expected English
  audio_asset_id  uuid references audio_assets(id)
);
```

### `audio_assets`

Pre-generated ElevenLabs audio, cached in Supabase Storage.

```sql
create table audio_assets (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,                  -- bucket/path.mp3
  duration_ms   int,
  voice_id      text,
  generated_at  timestamptz default now(),
  text_hash     text unique                     -- sha256 of (text_en + voice_id)
);
```

### `submissions`

One row per completed drill attempt.

```sql
create table submissions (
  id              uuid primary key default gen_random_uuid(),
  employee_id     uuid references employees(id) on delete cascade,
  scenario_id     uuid references scenarios(id),
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  score           numeric(4,2),                 -- 0.00 – 5.00
  level_attempted cefr_t,
  client_synced_at timestamptz,                 -- offline → online marker
  raw_answers     jsonb not null                -- {prompt_id: answer_payload}
);

create index on submissions (employee_id, completed_at desc);
```

**RLS**:
```sql
create policy "self read" on submissions for select
  using (employee_id in (select id from employees where auth_user_id = auth.uid()));
create policy "self insert" on submissions for insert
  with check (employee_id in (select id from employees where auth_user_id = auth.uid()));
```

### `feedback`

Claude-generated structured feedback attached to a submission.

```sql
create table feedback (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade unique,
  overall_es    text not null,                  -- 1-2 sentence manager-friendly summary
  strengths_es  text[],
  fixes_es      text[],                         -- specific corrections with examples
  pronunciation_notes jsonb,                    -- {word: note_es}[]
  claude_raw    jsonb,                          -- full response for audit
  created_at    timestamptz default now()
);
```

### `streaks`

Denormalized for fast reads. Updated via trigger on `submissions`.

```sql
create table streaks (
  employee_id      uuid primary key references employees(id) on delete cascade,
  current_days     int default 0,
  longest_days     int default 0,
  last_drill_date  date,
  updated_at       timestamptz default now()
);
```

### `stamps`

Earned achievements, shown in the "pasaporte" view.

```sql
create type stamp_kind_t as enum (
  'first_drill',       -- completed diagnostic
  'streak_7',          -- 7-day streak
  'streak_30',
  'level_up',          -- any CEFR shift up
  'unit_complete',     -- 10 drills of a unit
  'perfect_score',     -- 5.00 on a submission
  'anniversary'        -- 1 month / 3 month / etc
);

create table stamps (
  id              uuid primary key default gen_random_uuid(),
  employee_id     uuid references employees(id) on delete cascade,
  kind            stamp_kind_t not null,
  label_es        text not null,                -- "A2 → B1"
  context         jsonb,                        -- related scenario/submission
  earned_at       timestamptz default now()
);

create index on stamps (employee_id, earned_at desc);
create unique index on stamps (employee_id, kind)
  where kind in ('first_drill', 'streak_7', 'streak_30');  -- non-repeatable
```

### `level_history`

Append-only trail of CEFR assignments.

```sql
create table level_history (
  id            uuid primary key default gen_random_uuid(),
  employee_id   uuid references employees(id) on delete cascade,
  from_level    cefr_t,
  to_level      cefr_t not null,
  reason        text,                           -- "diagnostic", "promotion_by_score"
  created_at    timestamptz default now()
);
```

### `manager_messages` (postcard UI)

```sql
create table manager_messages (
  id            uuid primary key default gen_random_uuid(),
  hotel_id      uuid references hotels(id),
  employee_id   uuid references employees(id),
  body_es       text not null,
  signed_by     text,                           -- "Carlos G. — Gerente"
  sent_at       timestamptz default now(),
  read_at       timestamptz
);
```

---

## Triggers

### Streak update

```sql
create or replace function bump_streak() returns trigger as $$
declare
  prev_date date;
  today     date := (new.completed_at at time zone 'America/Mazatlan')::date;
begin
  select last_drill_date into prev_date from streaks where employee_id = new.employee_id;

  if prev_date is null then
    insert into streaks (employee_id, current_days, longest_days, last_drill_date)
      values (new.employee_id, 1, 1, today)
      on conflict (employee_id) do update
        set current_days = 1, longest_days = greatest(streaks.longest_days, 1), last_drill_date = today;
  elsif prev_date = today then
    -- already counted today, noop
    return new;
  elsif prev_date = today - interval '1 day' then
    update streaks set
      current_days = current_days + 1,
      longest_days = greatest(longest_days, current_days + 1),
      last_drill_date = today,
      updated_at = now()
    where employee_id = new.employee_id;
  else
    update streaks set current_days = 1, last_drill_date = today, updated_at = now()
      where employee_id = new.employee_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_submission_bump_streak
  after insert on submissions
  for each row when (new.completed_at is not null)
  execute function bump_streak();
```

### Streak stamp issuance

On streak update, if `current_days` hits 7, 30, 90 — insert into `stamps` (idempotent via unique index).

---

## Seed data required

At migration time, seed these tables with placeholder data so the app works locally without an admin UI:

- 1 hotel: `{ code: 'DEMO01', name: 'Hotel Gran Cabo', city: 'Los Cabos' }`
- ~30 scenarios — 10 per role × 4 levels. See `spec/content.md` for authoring guidance (TODO: Claude Code, ask Diego for scenario content export).

---

## Open questions

- [ ] Multi-hotel chains — one employee across multiple properties? (v1: no, one hotel per employee.)
- [ ] Audio retention — keep submission audio after scoring? (v1: delete after 30 days unless flagged.)
- [ ] Analytics events table or ship to Posthog? (v1: Posthog; schema only tracks business entities.)
