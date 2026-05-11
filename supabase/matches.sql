-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS partidas (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  modalidade   TEXT        NOT NULL,
  delegacao_a  TEXT        NOT NULL,
  jogador_a    TEXT        NOT NULL,
  placar_a     INTEGER     NOT NULL DEFAULT 0,
  delegacao_b  TEXT        NOT NULL,
  jogador_b    TEXT        NOT NULL,
  placar_b     INTEGER     NOT NULL DEFAULT 0,
  status       TEXT        NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  mvp          TEXT,
  link         TEXT,
  data         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE partidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON partidas
  FOR SELECT USING (true);

CREATE POLICY "admin_write" ON partidas
  FOR ALL USING (true) WITH CHECK (true);
