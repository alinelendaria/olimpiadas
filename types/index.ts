// ============================================================
// Core entity types for Olimpíadas TDJ Haxball
// ============================================================

export interface Country {
  id: string;
  name: string;
  flag: string;
  flagUrl?: string;
  code: string;
  colors: {
    primary: string;
    secondary?: string;
  };
}

export interface PlayerStats {
  wins: number;
  losses: number;
  mvps: number;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
}

export interface Player {
  id: string;
  name: string;
  country_id: string;
  stats: PlayerStats;
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  country_id: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export interface MatchTeam {
  delegacao: string;
  jogador: string;
  placar: number;
}

export interface Match {
  id: string;
  modalidade: string;
  equipaA: MatchTeam;
  equipaB: MatchTeam;
  status: MatchStatus;
  mvp: string | null;
  data: string;
  link: string | null;
}

export type ModalityType = 'x1' | 'x2' | 'x3' | 'traditional' | 'shootout' | 'king' | 'special';
export type ModalityStatus = 'aguardando' | 'em_andamento' | 'finalizado';
export type ModalityFormat = 'mata-mata' | 'grupos' | 'round-robin' | 'fase_de_grupos';

export interface Modality {
  id: string;
  nome: string;
  tipo: ModalityType;
  descricao: string;
  icone: string;
  status: ModalityStatus;
  formato: ModalityFormat;
  campeao: string | null;
  participantes: number;
  maxPorDelegacao: number;
}

export interface Ranking {
  position: number;
  country: Country;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  player_id: string;
}

// ============================================================
// Delegation type (used in mock data)
// ============================================================

export interface Delegacao {
  id: string;
  nome: string;
  codigo: string;
  bandeira: string;
  flagUrl: string;
  cor: string;
  corSecundaria: string;
  jogadores: string[];
  medalhas: {
    ouro: number;
    prata: number;
    bronze: number;
  };
  pontos: number;
}

// ============================================================
// Admin form data types
// ============================================================

export interface AdminMatchFormData {
  modalidade: string;
  delegacaoA: string;
  jogadorA: string;
  delegacaoB: string;
  jogadorB: string;
  placarA: number;
  placarB: number;
  status: MatchStatus;
  mvp: string;
  data: string;
  link: string;
}

export interface AdminMedalFormData {
  tipo: 'gold' | 'silver' | 'bronze';
  delegacaoId: string;
  jogadorId: string;
  modalidadeId: string;
}

export interface AdminPlayerFormData {
  nome: string;
  delegacaoId: string;
}

// ============================================================
// UI helper types
// ============================================================

export type GlowColor = 'cyan' | 'pink' | 'green' | 'gold' | 'none';
export type MedalType = 'gold' | 'silver' | 'bronze';

export interface NavLink {
  href: string;
  label: string;
  isLive?: boolean;
}

// ============================================================
// Bracket / Chaveamento types
// ============================================================

export interface BracketJogador {
  nome: string;
  delegacao: string;
}

export interface BracketFromRef {
  faseId: string;
  partidaId: number;
}

export interface BracketPartida {
  id: number;
  jogador1: BracketJogador | null;
  jogador2: BracketJogador | null;
  jogador1FromFase?: BracketFromRef;
  jogador2FromFase?: BracketFromRef;
  jogador2FromRep?: number; // legacy: repescagem match ID for jogador2
  vencedor: 1 | 2 | null;
  placar1: number | null;
  placar2: number | null;
  status: 'pendente' | 'ao_vivo' | 'finalizado';
}

export interface BracketFase {
  id: string;
  nome: string;
  partidas: BracketPartida[];
  equipes?: Array<{ nome: string; delegacao: string }>;
}

export interface Chaveamento {
  id: string;
  nome: string;
  icone: string;
  status: 'aguardando' | 'em_andamento' | 'finalizado';
  totalParticipantes: number;
  campeao: string | null;
  fases: BracketFase[];
}
