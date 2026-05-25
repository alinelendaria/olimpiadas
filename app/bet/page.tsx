'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import BetEventCard from '@/components/bet/BetEventCard';
import CoinIcon from '@/components/bet/CoinIcon';
import type { BetEvent, BetUser, BetBet } from '@/types/bet';

type Filter = 'todas' | 'aberta' | 'encerrada' | 'cancelada';

export default function BetPage() {
  const [events, setEvents]   = useState<BetEvent[]>([]);
  const [profile, setProfile] = useState<BetUser | null>(null);
  const [myBets, setMyBets]   = useState<BetBet[]>([]);
  const [filter, setFilter]   = useState<Filter>('aberta');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/bet/events').then(r => r.json()),
      fetch('/api/bet/profile').then(r => r.ok ? r.json() : null),
      fetch('/api/bet/my-bets').then(r => r.ok ? r.json() : null),
    ]).then(([ev, pr, mb]) => {
      setEvents(ev.events ?? []);
      if (pr) setProfile(pr.profile ?? null);
      if (mb) setMyBets(mb.bets ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'todas' ? events : events.filter(e => e.status === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'aberta',    label: 'Abertas' },
    { key: 'encerrada', label: 'Encerradas' },
    { key: 'cancelada', label: 'Canceladas' },
    { key: 'todas',     label: 'Todas' },
  ];

  const STATUS_STYLE: Record<string, string> = {
    aberta:    'text-blue-600 bg-blue-50 border-blue-100',
    ganha:     'text-green-700 bg-green-50 border-green-100',
    perdida:   'text-red-500 bg-red-50 border-red-100',
    cancelada: 'text-gray-400 bg-gray-50 border-gray-100',
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CoinIcon size={32} /> TDJ BET
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Apostas fictícias · apenas entretenimento</p>
          </div>

          {profile ? (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-right">
              <p className="text-xs text-amber-600">Seu saldo</p>
              <div className="flex items-center justify-end gap-1.5 text-xl font-extrabold text-amber-700">
                <CoinIcon size={22} /> {profile.saldo.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500">
              <Link href="/" className="text-accent font-medium hover:underline">Faça login</Link> para apostar
            </div>
          )}
        </div>

        {/* Stats rápidas do usuário */}
        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total apostado', value: profile.total_apostado.toLocaleString(),   coin: true },
              { label: 'Ganhos',         value: profile.total_ganho.toLocaleString(),       coin: true },
              { label: 'Win rate',       value: (profile.apostas_ganhas + profile.apostas_perdidas) > 0
                  ? `${((profile.apostas_ganhas / (profile.apostas_ganhas + profile.apostas_perdidas)) * 100).toFixed(1)}%`
                  : '—', coin: false },
              { label: 'Maior vitória',  value: profile.maior_vitoria.toLocaleString(),    coin: true },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-card text-center">
                <div className="flex items-center justify-center gap-1 text-base font-bold text-gray-900">
                  {s.coin && <CoinIcon size={15} />}
                  {s.value}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
                filter === f.key
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
              )}
            >
              {f.label}
              <span className="ml-1.5 text-xs opacity-60">
                {f.key === 'todas' ? events.length : events.filter(e => e.status === f.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Carregando apostas...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="flex justify-center mb-2"><CoinIcon size={40} /></div>
            <p className="text-sm">Nenhuma aposta encontrada.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map(event => {
              const userBet = myBets.find(b => b.event_id === event.id);
              return (
                <BetEventCard
                  key={event.id}
                  event={event}
                  userBetOptionId={userBet?.option_id ?? null}
                />
              );
            })}
          </div>
        )}

        {/* Histórico de apostas do usuário */}
        {myBets.length > 0 && (
          <div className="mt-12">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Minhas Apostas</h2>
            <div className="space-y-2">
              {myBets.map(bet => (
                <div key={bet.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-card flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {(bet.bet_events as { titulo?: string })?.titulo ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {bet.bet_options?.texto ?? '—'}
                      {' · '}×{Number(bet.bet_options?.odd ?? 1).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn('text-[11px] px-2 py-0.5 rounded-full border font-medium', STATUS_STYLE[bet.status] ?? '')}>
                      {bet.status}
                    </span>
                    <div className="text-right">
                      <p className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                        <CoinIcon size={13} /> {bet.valor}
                      </p>
                      {bet.status === 'ganha' && (
                        <p className="text-[11px] text-green-600">+{Math.floor(bet.retorno_possivel)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
