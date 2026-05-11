import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Delegacao } from '@/types';

// ────────────────────────────────────────────────────────────
// Tailwind class merger
// ────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ────────────────────────────────────────────────────────────
// Medal helpers
// ────────────────────────────────────────────────────────────
export function getMedalColor(type: 'gold' | 'silver' | 'bronze'): string {
  switch (type) {
    case 'gold':
      return '#ffd700';
    case 'silver':
      return '#c0c0c0';
    case 'bronze':
      return '#cd7f32';
  }
}

export function getMedalEmoji(type: 'gold' | 'silver' | 'bronze'): string {
  switch (type) {
    case 'gold':
      return '🥇';
    case 'silver':
      return '🥈';
    case 'bronze':
      return '🥉';
  }
}

// ────────────────────────────────────────────────────────────
// Position suffix (1st, 2nd, 3rd …)
// ────────────────────────────────────────────────────────────
export function getPositionSuffix(n: number): string {
  if (n === 1) return '1º';
  if (n === 2) return '2º';
  if (n === 3) return '3º';
  return `${n}º`;
}

// ────────────────────────────────────────────────────────────
// Date formatting
// ────────────────────────────────────────────────────────────
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeOnly(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ────────────────────────────────────────────────────────────
// Olympic points calculation
// gold = 3, silver = 2, bronze = 1
// ────────────────────────────────────────────────────────────
export function calculateOlympicPoints(gold: number, silver: number, bronze: number): number {
  return gold * 3 + silver * 2 + bronze * 1;
}

// ────────────────────────────────────────────────────────────
// Ranking sort: gold desc → silver desc → bronze desc → points desc
// ────────────────────────────────────────────────────────────
export interface RankingEntry {
  country: Delegacao;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  points: number;
}

export function sortByMedals(rankings: RankingEntry[]): RankingEntry[] {
  return [...rankings].sort((a, b) => {
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    if (b.bronze !== a.bronze) return b.bronze - a.bronze;
    return b.points - a.points;
  });
}

// ────────────────────────────────────────────────────────────
// Build ranking from delegacoes
// ────────────────────────────────────────────────────────────
export function buildRankingFromDelegacoes(delegacoes: Delegacao[]): RankingEntry[] {
  return sortByMedals(
    delegacoes.map((d) => ({
      country: d,
      gold: d.medalhas.ouro,
      silver: d.medalhas.prata,
      bronze: d.medalhas.bronze,
      total: d.medalhas.ouro + d.medalhas.prata + d.medalhas.bronze,
      points: calculateOlympicPoints(d.medalhas.ouro, d.medalhas.prata, d.medalhas.bronze),
    }))
  );
}

// ────────────────────────────────────────────────────────────
// Win rate
// ────────────────────────────────────────────────────────────
export function calculateWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}

// ────────────────────────────────────────────────────────────
// Get initials from a name
// ────────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ────────────────────────────────────────────────────────────
// Match result helper
// ────────────────────────────────────────────────────────────
export function getMatchWinner(
  scoreA: number,
  scoreB: number
): 'a' | 'b' | 'draw' {
  if (scoreA > scoreB) return 'a';
  if (scoreB > scoreA) return 'b';
  return 'draw';
}
