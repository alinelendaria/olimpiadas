'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { DELEGACOES, getAllPlayers, getDelegacaoById } from '@/lib/data/delegacoes';
import { calculateWinRate } from '@/lib/utils';

type SortCol = 'name' | 'wins' | 'losses' | 'mvps' | 'gold' | 'silver' | 'bronze' | 'winrate';

interface PlayerRow {
  nome: string;
  delegacaoId: string;
  delegacaoNome: string;
  bandeira: string;
  flagUrl: string;
  wins: number;
  losses: number;
  mvps: number;
  gold: number;
  silver: number;
  bronze: number;
}

export default function PlayerRankingTable() {
  const [sortCol, setSortCol]       = useState<SortCol>('wins');
  const [sortDir, setSortDir]       = useState<'asc' | 'desc'>('desc');
  const [filterCountry, setFilter]  = useState('all');
  const [search, setSearch]         = useState('');

  const allPlayers = useMemo<PlayerRow[]>(() => {
    return getAllPlayers().map((p) => {
      const d = getDelegacaoById(p.delegacaoId);
      return { ...p, flagUrl: d?.flagUrl ?? '', wins: 0, losses: 0, mvps: 0, gold: 0, silver: 0, bronze: 0 };
    });
  }, []);

  const filtered = useMemo(() => {
    let list = allPlayers;
    if (filterCountry !== 'all') list = list.filter((p) => p.delegacaoId === filterCountry);
    if (search.trim()) list = list.filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()));
    return [...list].sort((a, b) => {
      let va: number | string = 0, vb: number | string = 0;
      if (sortCol === 'name')    { va = a.nome;    vb = b.nome; }
      else if (sortCol === 'wins')  { va = a.wins;    vb = b.wins; }
      else if (sortCol === 'losses'){ va = a.losses;  vb = b.losses; }
      else if (sortCol === 'mvps')  { va = a.mvps;    vb = b.mvps; }
      else if (sortCol === 'gold')  { va = a.gold;    vb = b.gold; }
      else if (sortCol === 'silver'){ va = a.silver;  vb = b.silver; }
      else if (sortCol === 'bronze'){ va = a.bronze;  vb = b.bronze; }
      else { va = a.wins + a.losses === 0 ? 0 : a.wins / (a.wins + a.losses); vb = b.wins + b.losses === 0 ? 0 : b.wins / (b.wins + b.losses); }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }, [allPlayers, sortCol, sortDir, filterCountry, search]);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('desc'); }
  };

  const Th = ({ col, label }: { col: SortCol; label: string }) => (
    <th
      className={`px-3 py-3 text-xs font-semibold text-center cursor-pointer select-none whitespace-nowrap transition-colors ${
        sortCol === col ? 'text-accent' : 'text-gray-400 hover:text-gray-600'
      }`}
      onClick={() => toggleSort(col)}
    >
      {label}{sortCol === col ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar jogador…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:border-accent"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              filterCountry === 'all' ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            Todos
          </button>
          {DELEGACOES.map((d) => (
            <button
              key={d.id}
              onClick={() => setFilter(d.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filterCountry === d.id ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Image src={d.flagUrl} alt={d.nome} width={16} height={11} className="flag-img" unoptimized />
              {d.codigo}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-3 py-3 text-xs text-gray-400 font-medium text-center w-10">#</th>
              <Th col="name" label="Jogador" />
              <th className="px-3 py-3 text-xs text-gray-400 font-medium text-center">País</th>
              <Th col="gold"    label="🥇" />
              <Th col="silver"  label="🥈" />
              <Th col="bronze"  label="🥉" />
              <Th col="mvps"    label="MVPs" />
              <Th col="wins"    label="V" />
              <Th col="losses"  label="D" />
              <Th col="winrate" label="Taxa" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={`${p.delegacaoId}-${p.nome}`}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                  i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''
                }`}
              >
                <td className="px-3 py-3 text-xs text-gray-400 text-center font-medium">{i + 1}</td>
                <td className="px-3 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{p.nome}</td>
                <td className="px-3 py-3 text-center">
                  <Image src={p.flagUrl} alt={p.delegacaoNome} width={24} height={16} className="flag-img inline-block" unoptimized />
                </td>
                <td className="px-3 py-3 text-sm text-center font-semibold medal-gold tabular-nums">{p.gold}</td>
                <td className="px-3 py-3 text-sm text-center font-semibold medal-silver tabular-nums">{p.silver}</td>
                <td className="px-3 py-3 text-sm text-center font-semibold medal-bronze tabular-nums">{p.bronze}</td>
                <td className="px-3 py-3 text-sm text-center font-medium text-purple-500 tabular-nums">{p.mvps}</td>
                <td className="px-3 py-3 text-sm text-center font-medium text-green-600 tabular-nums">{p.wins}</td>
                <td className="px-3 py-3 text-sm text-center font-medium text-gray-400 tabular-nums">{p.losses}</td>
                <td className="px-3 py-3 text-sm text-center font-medium text-accent tabular-nums">
                  {calculateWinRate(p.wins, p.losses)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">{filtered.length} jogadores · Estatísticas atualizadas após cada partida</p>
    </div>
  );
}
