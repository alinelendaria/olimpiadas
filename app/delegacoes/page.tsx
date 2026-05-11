'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { DELEGACOES } from '@/lib/data/delegacoes';
import DelegationCard from '@/components/delegacoes/DelegationCard';

type FilterType = 'all' | 'most-players' | 'alpha';

export default function DelegacoesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    let list = [...DELEGACOES];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.nome.toLowerCase().includes(q) ||
          d.codigo.toLowerCase().includes(q) ||
          d.jogadores.some((j) => j.toLowerCase().includes(q))
      );
    }
    if (filter === 'most-players') list.sort((a, b) => b.jogadores.length - a.jogadores.length);
    else if (filter === 'alpha')   list.sort((a, b) => a.nome.localeCompare(b.nome));
    return list;
  }, [search, filter]);

  const totalPlayers = DELEGACOES.reduce((sum, d) => sum + d.jogadores.length, 0);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Delegações</h1>
          <p className="text-gray-500 mt-1">
            {DELEGACOES.length} países · {totalPlayers} atletas
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { value: DELEGACOES.length, label: 'Delegações' },
            { value: totalPlayers,       label: 'Atletas' },
            { value: 7,                  label: 'Modalidades' },
            { value: 0,                  label: 'Medalhas Dist.' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar delegação ou atleta…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-2">
            {[
              { value: 'all',          label: 'Todas' },
              { value: 'most-players', label: 'Mais Atletas' },
              { value: 'alpha',        label: 'A→Z' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as FilterType)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  filter === f.value
                    ? 'bg-accent text-white border-accent'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500">Nenhuma delegação encontrada para &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((delegacao) => (
              <DelegationCard key={delegacao.id} delegacao={delegacao} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
