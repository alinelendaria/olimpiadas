'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DELEGACOES, getAllPlayers } from '@/lib/data/delegacoes';
import { Search } from 'lucide-react';

export default function AdminJogadoresPage() {
  const [search,        setSearch]        = useState('');
  const [filterCountry, setFilterCountry] = useState('all');

  const allPlayers = getAllPlayers();
  const filtered   = allPlayers.filter((p) => {
    if (filterCountry !== 'all' && p.delegacaoId !== filterCountry) return false;
    if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Gerenciar Atletas</h1>
      <p className="text-sm text-gray-400 mb-8">Total: {allPlayers.length} atletas registrados.</p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar atleta…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent bg-white"
        >
          <option value="all">Todas as delegações</option>
          {DELEGACOES.map((d) => (
            <option key={d.id} value={d.id}>{d.bandeira} {d.nome}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
        <div className="grid grid-cols-[36px_1fr_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-400 uppercase tracking-widest">
          <div>#</div>
          <div>Atleta</div>
          <div>Delegação</div>
          <div>Ações</div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">Nenhum atleta encontrado.</div>
        ) : (
          filtered.map((player, i) => {
            const deleg = DELEGACOES.find((d) => d.id === player.delegacaoId);
            return (
              <div
                key={`${player.delegacaoId}-${player.nome}`}
                className="grid grid-cols-[36px_1fr_auto_auto] gap-4 px-5 py-3 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs text-gray-400 tabular-nums">{i + 1}</span>
                <span className="text-sm font-medium text-gray-800 truncate">{player.nome}</span>
                <div className="flex items-center gap-2">
                  {deleg && (
                    <Image src={deleg.flagUrl} alt={deleg.nome} width={20} height={14} className="flag-img" unoptimized />
                  )}
                  <span className="text-xs text-gray-400">{deleg?.codigo}</span>
                </div>
                <button className="text-xs text-accent hover:underline px-2 py-1">Editar</button>
              </div>
            );
          })
        )}
      </div>

      <p className="mt-3 text-xs text-gray-400 text-center">
        {filtered.length} de {allPlayers.length} atletas
      </p>
    </div>
  );
}
