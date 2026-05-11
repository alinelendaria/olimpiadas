import type { Match } from '@/types';

export const PARTIDAS: Match[] = [];

export function getPartidasByStatus(status: Match['status']): Match[] {
  return PARTIDAS.filter((p) => p.status === status);
}

export function getPartidasByModalidade(modalidade: string): Match[] {
  return PARTIDAS.filter((p) => p.modalidade === modalidade);
}

export function getLatestFinishedMatches(count = 4): Match[] {
  return PARTIDAS.filter((p) => p.status === 'finished')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, count);
}

export function getLiveMatches(): Match[] {
  return PARTIDAS.filter((p) => p.status === 'live');
}

export function getUpcomingMatches(count = 5): Match[] {
  return PARTIDAS.filter((p) => p.status === 'scheduled')
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .slice(0, count);
}
