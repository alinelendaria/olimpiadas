'use client';

import Image from 'next/image';
import { getDelegacaoById } from '@/lib/data/delegacoes';
import type { Partida } from '@/types';

interface Props {
  match: Partida;
}

export default function MatchCard({ match }: Props) {
  const a = getDelegacaoById(match.equipaA.delegacao);
  const b = getDelegacaoById(match.equipaB.delegacao);
  if (!a || !b) return null;

  const isLive      = match.status === 'live';
  const isFinished  = match.status === 'finished';
  const isScheduled = match.status === 'scheduled';
  const winnerA     = isFinished && match.equipaA.placar > match.equipaB.placar;
  const winnerB     = isFinished && match.equipaB.placar > match.equipaA.placar;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          {match.modalidade}
        </span>

        {isLive && (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <span className="live-dot" />
            Ao Vivo
          </span>
        )}
        {isFinished && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            Finalizado
          </span>
        )}
        {isScheduled && (
          <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
            Agendado
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-3">
        {/* Team A */}
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${isFinished && !winnerA ? 'opacity-45' : ''}`}>
          <Image
            src={a.flagUrl}
            alt={a.nome}
            width={44}
            height={30}
            className="flag-img w-11 h-[30px]"
            unoptimized
          />
          <p className="text-xs font-semibold text-gray-700 text-center leading-tight max-w-[80px] truncate">
            {match.equipaA.jogador}
          </p>
          <p className="text-[10px] text-gray-400">{a.codigo}</p>
        </div>

        {/* Score / VS */}
        <div className="flex items-center gap-2.5 shrink-0 min-w-[80px] justify-center">
          {isScheduled ? (
            <span className="text-sm font-medium text-gray-300">VS</span>
          ) : (
            <>
              <span className={`text-2xl font-bold tabular-nums ${winnerA ? 'text-gray-900' : 'text-gray-400'}`}>
                {match.equipaA.placar}
              </span>
              <span className="text-gray-200">—</span>
              <span className={`text-2xl font-bold tabular-nums ${winnerB ? 'text-gray-900' : 'text-gray-400'}`}>
                {match.equipaB.placar}
              </span>
            </>
          )}
        </div>

        {/* Team B */}
        <div className={`flex flex-col items-center gap-1.5 flex-1 ${isFinished && !winnerB ? 'opacity-45' : ''}`}>
          <Image
            src={b.flagUrl}
            alt={b.nome}
            width={44}
            height={30}
            className="flag-img w-11 h-[30px]"
            unoptimized
          />
          <p className="text-xs font-semibold text-gray-700 text-center leading-tight max-w-[80px] truncate">
            {match.equipaB.jogador}
          </p>
          <p className="text-[10px] text-gray-400">{b.codigo}</p>
        </div>
      </div>

      {/* MVP / date */}
      {match.mvp && (
        <p className="text-xs text-gray-400 text-center mt-3">
          MVP: <span className="text-gray-600 font-medium">{match.mvp}</span>
        </p>
      )}
      {isScheduled && match.data && (
        <p className="text-xs text-gray-400 text-center mt-3">
          {new Date(match.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      )}
    </div>
  );
}
