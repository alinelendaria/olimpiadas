'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import BetPlaceModal from '@/components/bet/BetPlaceModal';
import type { BetEvent, BetUser, BetBet } from '@/types/bet';

const STATUS_LABEL = { aberta: 'Aberta', encerrada: 'Encerrada', cancelada: 'Cancelada' };
const STATUS_STYLE = {
  aberta:    'text-green-700 bg-green-50 border-green-200',
  encerrada: 'text-gray-500 bg-gray-50 border-gray-200',
  cancelada: 'text-red-500 bg-red-50 border-red-200',
};

export default function BetEventPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [event,   setEvent]   = useState<BetEvent | null>(null);
  const [profile, setProfile] = useState<BetUser | null>(null);
  const [userBet, setUserBet] = useState<BetBet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bet/events/${id}`).then(r => r.ok ? r.json() : null),
      fetch('/api/bet/profile').then(r => r.ok ? r.json() : null),
    ]).then(([ev, pr]) => {
      if (ev?.event) setEvent(ev.event);
      if (ev?.userBet) setUserBet(ev.userBet);
      if (pr?.profile) setProfile(pr.profile);
      setLoading(false);
    });
  }, [id]);

  function handleBetSuccess(newProfile: BetUser) {
    setProfile(newProfile);
    setShowModal(false);
    // Refresh userBet
    fetch(`/api/bet/events/${id}`).then(r => r.ok ? r.json() : null).then(ev => {
      if (ev?.userBet) setUserBet(ev.userBet);
      if (ev?.event)   setEvent(ev.event);
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Carregando evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Evento não encontrado.</p>
        <Link href="/bet" className="text-accent text-sm hover:underline">← Voltar às apostas</Link>
      </div>
    );
  }

  const options     = event.bet_options ?? [];
  const winnerOpt   = options.find(o => o.id === event.opcao_vencedora_id);
  const userOptId   = userBet?.option_id ?? null;
  const userOption  = options.find(o => o.id === userOptId);
  const canBet      = event.status === 'aberta' && !userBet && !!profile;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link href="/bet" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Apostas
        </Link>

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card px-6 py-5 mb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{event.titulo}</h1>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border shrink-0', STATUS_STYLE[event.status])}>
              {STATUS_LABEL[event.status]}
            </span>
          </div>

          {event.descricao && (
            <p className="text-sm text-gray-500 mb-4">{event.descricao}</p>
          )}

          {event.encerra_em && event.status === 'aberta' && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              Encerra em {new Date(event.encerra_em).toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        {/* Opções */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card px-6 py-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Opções de aposta</h2>
          <div className="space-y-2.5">
            {options.map(opt => {
              const isWinner  = opt.id === event.opcao_vencedora_id;
              const isUserBet = opt.id === userOptId;
              return (
                <div
                  key={opt.id}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-xl border',
                    isWinner  ? 'bg-green-50 border-green-200' :
                    isUserBet ? 'bg-accent-light border-accent/30' :
                                'bg-gray-50 border-gray-100'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isWinner  && <span className="text-green-600 font-bold text-sm">✓</span>}
                    {isUserBet && !isWinner && <span className="text-sm">🎯</span>}
                    <span className={cn(
                      'text-sm font-medium',
                      isWinner  ? 'text-green-700' :
                      isUserBet ? 'text-accent' :
                                  'text-gray-700'
                    )}>
                      {opt.texto}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'text-sm font-bold',
                      isWinner  ? 'text-green-600' :
                      isUserBet ? 'text-accent' :
                                  'text-amber-600'
                    )}>
                      ×{Number(opt.odd).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sua aposta (se já apostou) */}
        {userBet && userOption && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-card px-6 py-5 mb-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Sua aposta</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  🎯 {userOption.texto}
                  <span className="ml-2 text-xs text-amber-600 font-bold">×{Number(userOption.odd).toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Valor apostado: 🪙 {userBet.valor}</p>
              </div>
              <div className="text-right">
                {userBet.status === 'ganha' ? (
                  <div>
                    <p className="text-sm font-bold text-green-700">+{Math.floor(userBet.retorno_possivel)} 🪙</p>
                    <p className="text-xs text-green-500">Ganhou!</p>
                  </div>
                ) : userBet.status === 'perdida' ? (
                  <p className="text-sm font-medium text-red-500">Perdeu</p>
                ) : userBet.status === 'cancelada' ? (
                  <p className="text-sm font-medium text-gray-400">Cancelada</p>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-gray-900">🪙 {Math.floor(userBet.retorno_possivel)}</p>
                    <p className="text-xs text-gray-400">retorno possível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA apostar */}
        {event.status === 'aberta' && (
          <div className="mt-2">
            {!profile ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Faça login para apostar</p>
                <Link href="/" className="text-accent text-sm font-medium hover:underline">Entrar com Discord →</Link>
              </div>
            ) : userBet ? (
              <p className="text-center text-xs text-gray-400">Você já apostou neste evento.</p>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                🪙 Fazer aposta — saldo: {profile.saldo.toLocaleString()}
              </button>
            )}
          </div>
        )}

        {event.status === 'encerrada' && !userBet && (
          <p className="text-center text-xs text-gray-400 mt-2">Este evento foi encerrado.</p>
        )}

        {event.status === 'cancelada' && (
          <p className="text-center text-xs text-gray-400 mt-2">Este evento foi cancelado.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && profile && (
        <BetPlaceModal
          event={event}
          profile={profile}
          onClose={() => setShowModal(false)}
          onSuccess={handleBetSuccess}
        />
      )}
    </div>
  );
}
