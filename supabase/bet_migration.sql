-- =============================================
-- TDJ BET SYSTEM — Supabase SQL Migration
-- Cole e execute no Supabase SQL Editor
-- =============================================

-- TABLES ---------------------------------------------------

CREATE TABLE IF NOT EXISTS bet_users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_id    text,
  username      text NOT NULL DEFAULT 'Usuário',
  avatar_url    text,
  saldo         integer NOT NULL DEFAULT 1000,
  total_apostado integer NOT NULL DEFAULT 0,
  total_ganho   integer NOT NULL DEFAULT 0,
  total_perdido integer NOT NULL DEFAULT 0,
  apostas_ganhas   integer NOT NULL DEFAULT 0,
  apostas_perdidas integer NOT NULL DEFAULT 0,
  maior_vitoria integer NOT NULL DEFAULT 0,
  last_daily_reward timestamptz,
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS bet_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo        text NOT NULL,
  descricao     text,
  status        text NOT NULL DEFAULT 'aberta'
    CONSTRAINT bet_events_status CHECK (status IN ('aberta','encerrada','cancelada')),
  opcao_vencedora_id uuid,
  encerra_em    timestamptz,
  created_by    uuid REFERENCES auth.users(id),
  created_at    timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS bet_options (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES bet_events(id) ON DELETE CASCADE,
  texto      text NOT NULL,
  odd        numeric(5,2) NOT NULL DEFAULT 1.50,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- FK circular (adicionada depois de bet_options existir)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_opcao_vencedora' AND table_name = 'bet_events'
  ) THEN
    ALTER TABLE bet_events
      ADD CONSTRAINT fk_opcao_vencedora
      FOREIGN KEY (opcao_vencedora_id) REFERENCES bet_options(id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS bet_bets (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES bet_events(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES bet_options(id) ON DELETE CASCADE,
  valor    integer NOT NULL CHECK (valor > 0),
  retorno_possivel numeric(10,2),
  status   text NOT NULL DEFAULT 'aberta'
    CONSTRAINT bet_bets_status CHECK (status IN ('aberta','ganha','perdida','cancelada')),
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT bet_bets_one_per_event UNIQUE (user_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_bet_bets_user    ON bet_bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bet_bets_event   ON bet_bets(event_id);
CREATE INDEX IF NOT EXISTS idx_bet_options_event ON bet_options(event_id);
CREATE INDEX IF NOT EXISTS idx_bet_events_status ON bet_events(status);

-- RLS ------------------------------------------------------

ALTER TABLE bet_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bet_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bet_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE bet_bets    ENABLE ROW LEVEL SECURITY;

-- Drop se já existirem
DROP POLICY IF EXISTS "bu_read"    ON bet_users;
DROP POLICY IF EXISTS "bu_insert"  ON bet_users;
DROP POLICY IF EXISTS "bu_update"  ON bet_users;
DROP POLICY IF EXISTS "be_read"    ON bet_events;
DROP POLICY IF EXISTS "be_write"   ON bet_events;
DROP POLICY IF EXISTS "bo_read"    ON bet_options;
DROP POLICY IF EXISTS "bo_write"   ON bet_options;
DROP POLICY IF EXISTS "bb_read"    ON bet_bets;
DROP POLICY IF EXISTS "bb_insert"  ON bet_bets;
DROP POLICY IF EXISTS "bb_update"  ON bet_bets;

-- bet_users
CREATE POLICY "bu_read"   ON bet_users FOR SELECT USING (true);
CREATE POLICY "bu_insert" ON bet_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "bu_update" ON bet_users FOR UPDATE USING (auth.uid() = id);

-- bet_events (leitura pública; escrita autenticada — admin checado na API)
CREATE POLICY "be_read"  ON bet_events FOR SELECT USING (true);
CREATE POLICY "be_write" ON bet_events FOR ALL   USING (auth.role() = 'authenticated');

-- bet_options
CREATE POLICY "bo_read"  ON bet_options FOR SELECT USING (true);
CREATE POLICY "bo_write" ON bet_options FOR ALL   USING (auth.role() = 'authenticated');

-- bet_bets
CREATE POLICY "bb_read"   ON bet_bets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bb_insert" ON bet_bets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bb_update" ON bet_bets FOR UPDATE USING (true); -- SECURITY DEFINER faz isso

-- SECURITY DEFINER FUNCTIONS --------------------------------

-- Resolve evento: paga ganhadores, marca perdedores
CREATE OR REPLACE FUNCTION resolve_bet_event(
  p_event_id          uuid,
  p_opcao_vencedora_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bet     RECORD;
  v_odd     numeric;
  v_retorno integer;
  v_winners int := 0;
  v_losers  int := 0;
  v_paid    integer := 0;
BEGIN
  UPDATE bet_events
     SET status = 'encerrada', opcao_vencedora_id = p_opcao_vencedora_id
   WHERE id = p_event_id AND status = 'aberta';

  FOR v_bet IN
    SELECT id, user_id, option_id, valor
      FROM bet_bets
     WHERE event_id = p_event_id AND status = 'aberta'
  LOOP
    SELECT odd INTO v_odd FROM bet_options WHERE id = v_bet.option_id;

    IF v_bet.option_id = p_opcao_vencedora_id THEN
      v_retorno := FLOOR(v_bet.valor * v_odd)::integer;
      UPDATE bet_bets SET status = 'ganha', retorno_possivel = v_retorno  WHERE id = v_bet.id;
      UPDATE bet_users SET
        saldo          = saldo + v_retorno,
        total_ganho    = total_ganho + v_retorno,
        apostas_ganhas = apostas_ganhas + 1,
        maior_vitoria  = GREATEST(maior_vitoria, v_retorno - v_bet.valor)
      WHERE id = v_bet.user_id;
      v_winners := v_winners + 1;
      v_paid    := v_paid + v_retorno;
    ELSE
      UPDATE bet_bets SET status = 'perdida' WHERE id = v_bet.id;
      UPDATE bet_users SET
        total_perdido    = total_perdido + v_bet.valor,
        apostas_perdidas = apostas_perdidas + 1
      WHERE id = v_bet.user_id;
      v_losers := v_losers + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('winners', v_winners, 'losers', v_losers, 'paid_out', v_paid);
END;
$$;

-- Cancela evento e reembolsa apostas
CREATE OR REPLACE FUNCTION cancel_bet_event(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bet RECORD;
BEGIN
  UPDATE bet_events SET status = 'cancelada' WHERE id = p_event_id;

  FOR v_bet IN
    SELECT id, user_id, valor FROM bet_bets
     WHERE event_id = p_event_id AND status = 'aberta'
  LOOP
    UPDATE bet_bets  SET status = 'cancelada' WHERE id = v_bet.id;
    UPDATE bet_users SET
      saldo          = saldo + v_bet.valor,
      total_apostado = total_apostado - v_bet.valor
    WHERE id = v_bet.user_id;
  END LOOP;
END;
$$;

-- Recompensa diária (+100 moedas, cooldown 24h)
CREATE OR REPLACE FUNCTION claim_daily_reward(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last  timestamptz;
  v_now   timestamptz := now();
  v_next  timestamptz;
BEGIN
  SELECT last_daily_reward INTO v_last FROM bet_users WHERE id = p_user_id;

  IF v_last IS NOT NULL AND v_now < v_last + INTERVAL '24 hours' THEN
    RETURN jsonb_build_object(
      'success',     false,
      'error',       'cooldown',
      'next_reward', (v_last + INTERVAL '24 hours')
    );
  END IF;

  v_next := v_now + INTERVAL '24 hours';
  UPDATE bet_users
     SET saldo = saldo + 100, last_daily_reward = v_now
   WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'next_reward', v_next);
END;
$$;
