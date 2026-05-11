-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bracket_partidas (
  chaveamento_id TEXT        NOT NULL,
  fase_id        TEXT        NOT NULL,
  partida_id     INTEGER     NOT NULL,
  vencedor       INTEGER     CHECK (vencedor IN (1, 2)),
  placar1        INTEGER,
  placar2        INTEGER,
  status         TEXT        NOT NULL DEFAULT 'finalizado',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chaveamento_id, fase_id, partida_id)
);

-- If the table already exists without placar columns, run:
-- ALTER TABLE bracket_partidas ADD COLUMN IF NOT EXISTS placar1 INTEGER;
-- ALTER TABLE bracket_partidas ADD COLUMN IF NOT EXISTS placar2 INTEGER;

ALTER TABLE bracket_partidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON bracket_partidas
  FOR SELECT USING (true);

CREATE POLICY "admin_write" ON bracket_partidas
  FOR ALL USING (true) WITH CHECK (true);
