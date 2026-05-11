'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getLiveMatches, getUpcomingMatches } from '@/lib/data/partidas';
import { getDelegacaoById } from '@/lib/data/delegacoes';
import MatchCard from '@/components/partidas/MatchCard';
import { formatDate } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function AoVivoPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [spinning,    setSpinning]    = useState(false);

  const liveMatches = getLiveMatches();
  const upcoming    = getUpcomingMatches(5);

  const handleRefresh = () => {
    setSpinning(true);
    setTimeout(() => { setLastUpdated(new Date()); setSpinning(false); }, 700);
  };

  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="live-dot" /> Ao Vivo
            </h1>
            <p className="text-gray-500 mt-1">Partidas em tempo real</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} />
            Atualizar · {lastUpdated.toLocaleTimeString('pt-BR')}
          </button>
        </div>

        {/* Live matches */}
        {liveMatches.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-card mb-8">
            <p className="text-5xl mb-4">⚽</p>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Nenhum jogo ao vivo</h2>
            <p className="text-sm text-gray-400">
              Assim que uma partida começar, ela aparecerá aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
              <span className="live-dot" /> Em andamento
            </h2>
            {liveMatches.map((match) => {
              const a = getDelegacaoById(match.equipaA.delegacao);
              const b = getDelegacaoById(match.equipaB.delegacao);
              return (
                <div key={match.id} className="bg-white border border-red-100 rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between gap-4">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      {a && (
                        <Image src={a.flagUrl} alt={a.nome} width={56} height={38} className="flag-img w-14 h-[38px]" unoptimized />
                      )}
                      <p className="text-sm font-semibold text-gray-800 text-center">{match.equipaA.jogador}</p>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold tabular-nums text-gray-900">{match.equipaA.placar}</span>
                        <span className="text-gray-300 text-2xl font-light">×</span>
                        <span className="text-4xl font-bold tabular-nums text-gray-900">{match.equipaB.placar}</span>
                      </div>
                      <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                        <span className="live-dot" style={{ width: 5, height: 5 }} />
                        AO VIVO · {match.modalidade}
                      </span>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      {b && (
                        <Image src={b.flagUrl} alt={b.nome} width={56} height={38} className="flag-img w-14 h-[38px]" unoptimized />
                      )}
                      <p className="text-sm font-semibold text-gray-800 text-center">{match.equipaB.jogador}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-4">Próximas Partidas</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma partida agendada.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((match) => {
                const a = getDelegacaoById(match.equipaA.delegacao);
                const b = getDelegacaoById(match.equipaB.delegacao);
                return (
                  <div key={match.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 shadow-card">
                    <div className="flex items-center gap-2 flex-1">
                      {a && <Image src={a.flagUrl} alt={a.nome} width={24} height={16} className="flag-img" unoptimized />}
                      <span className="text-sm font-medium text-gray-700">{match.equipaA.jogador}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">VS</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(match.data)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-medium text-gray-700">{match.equipaB.jogador}</span>
                      {b && <Image src={b.flagUrl} alt={b.nome} width={24} height={16} className="flag-img" unoptimized />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
