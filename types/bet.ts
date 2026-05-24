export interface BetUser {
  id: string;
  discord_id: string | null;
  username: string;
  avatar_url: string | null;
  saldo: number;
  total_apostado: number;
  total_ganho: number;
  total_perdido: number;
  apostas_ganhas: number;
  apostas_perdidas: number;
  maior_vitoria: number;
  last_daily_reward: string | null;
  created_at: string;
}

export interface BetOption {
  id: string;
  event_id: string;
  texto: string;
  odd: number;
  created_at: string;
}

export interface BetEvent {
  id: string;
  titulo: string;
  descricao: string | null;
  status: 'aberta' | 'encerrada' | 'cancelada';
  opcao_vencedora_id: string | null;
  encerra_em: string | null;
  created_at: string;
  bet_options?: BetOption[];
}

export interface BetBet {
  id: string;
  user_id: string;
  event_id: string;
  option_id: string;
  valor: number;
  retorno_possivel: number;
  status: 'aberta' | 'ganha' | 'perdida' | 'cancelada';
  created_at: string;
  bet_options?: BetOption;
  bet_events?: Partial<BetEvent>;
}
