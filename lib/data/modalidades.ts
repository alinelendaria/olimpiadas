import type { Modality } from '@/types';

export const MODALIDADES: Modality[] = [
  {
    id: 'x1',
    nome: 'X1 - Duelo',
    tipo: 'x1',
    descricao: 'Confronto individual. Um jogador vs um jogador. O melhor de 5 gols vence a partida. Exige habilidade técnica e leitura de jogo.',
    icone: '⚔️',
    status: 'aguardando',
    formato: 'mata-mata',
    campeao: null,
    participantes: 16,
    maxPorDelegacao: 2,
  },
  {
    id: 'x2',
    nome: 'X2 - Duplas',
    tipo: 'x2',
    descricao: 'Confronto em dupla. Dois jogadores da mesma delegação vs dois adversários. Comunicação e sinergia são essenciais.',
    icone: '👥',
    status: 'aguardando',
    formato: 'mata-mata',
    campeao: null,
    participantes: 12,
    maxPorDelegacao: 2,
  },
  {
    id: 'x3',
    nome: 'X3 - Trios',
    tipo: 'x3',
    descricao: 'Confronto em trio. Três jogadores por delegação disputam em campo. Estratégia coletiva e posicionamento são determinantes.',
    icone: '🎯',
    status: 'aguardando',
    formato: 'fase_de_grupos',
    campeao: null,
    participantes: 9,
    maxPorDelegacao: 3,
  },
  {
    id: 'futebol',
    nome: 'Futebol Tradicional',
    tipo: 'traditional',
    descricao: 'O clássico do Haxball. Times completos de cada delegação disputam partidas de futebol no formato tradicional.',
    icone: '⚽',
    status: 'aguardando',
    formato: 'grupos',
    campeao: null,
    participantes: 9,
    maxPorDelegacao: 5,
  },
  {
    id: 'rei-da-quadra',
    nome: 'Rei da Quadra',
    tipo: 'king',
    descricao: 'Modalidade especial onde o vencedor permanece em campo e enfrenta o próximo desafiante. O rei que mais defesas manter vence.',
    icone: '👑',
    status: 'em_andamento',
    formato: 'round-robin',
    campeao: null,
    participantes: 16,
    maxPorDelegacao: 2,
  },
  {
    id: 'shootout',
    nome: 'Shootout',
    tipo: 'shootout',
    descricao: 'Disputa de pênaltis estilo Haxball. Cada jogador tem 5 tentativas para converter o máximo de gols contra o goleiro adversário.',
    icone: '🥅',
    status: 'em_andamento',
    formato: 'mata-mata',
    campeao: null,
    participantes: 16,
    maxPorDelegacao: 2,
  },
  {
    id: 'desafio-especial',
    nome: 'Desafio Especial',
    tipo: 'special',
    descricao: 'Modalidade surpresa revelada no dia do evento. Pode ser qualquer formato criativo que teste habilidades únicas dos competidores.',
    icone: '⭐',
    status: 'aguardando',
    formato: 'mata-mata',
    campeao: null,
    participantes: 8,
    maxPorDelegacao: 1,
  },
];

export function getModalidadeById(id: string): Modality | undefined {
  return MODALIDADES.find((m) => m.id === id);
}

export function getModalidadesByStatus(status: Modality['status']): Modality[] {
  return MODALIDADES.filter((m) => m.status === status);
}
