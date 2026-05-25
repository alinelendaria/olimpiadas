'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import CoinIcon from '@/components/bet/CoinIcon';
import type { BetEvent } from '@/types/bet';

const STATUS_LABEL = { aberta: 'Aberta', encerrada: 'Encerrada', cancelada: 'Cancelada' };
const STATUS_STYLE = {
  aberta:    'text-green-700 bg-green-50 border-green-100',
  encerrada: 'text-gray-500 bg-gray-50 border-gray-100',
  cancelada: 'text-red-500 bg-red-50 border-red-100',
};

interface Props {
  event: BetEvent;
  userBetOptionId?: string | null;
}

export default function BetEventCard({ event, userBetOptionId }: Props) {
  const options = event.bet_options ?? [];
  const maxOdd  = options.length > 0 ? Math.max(...options.map(o => Number(o.odd))) : 0;

  return (
    <Link
      href={`/bet/${event.id}`}
      className="group block bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-accent transition-colors leading-snug">
          {event.titulo}
        </h3>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border shrink-0', STATUS_STYLE[event.status])}>
          {STATUS_LABEL[event.status]}
        </span>
      </div>

      {event.descricao && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{event.descricao}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const isWinner  = event.opcao_vencedora_id === opt.id;
          const isUserBet = userBetOptionId === opt.id;
          return (
            <span
              key={opt.id}
              className={cn(
                'text-xs px-2.5 py-1 rounded-lg border font-medium',
                isWinner  ? 'bg-green-50 border-green-200 text-green-700' :
                isUserBet ? 'bg-accent-light border-accent/30 text-accent' :
                            'bg-gray-50 border-gray-100 text-gray-600'
              )}
            >
              {opt.texto}
              <span className="ml-1 text-[10px] opacity-60">×{Number(opt.odd).toFixed(2)}</span>
              {isWinner  && <span className="ml-1">✓</span>}
              {isUserBet && !isWinner && <span className="ml-1">🎯</span>}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-[11px] text-gray-400">
          {options.length} {options.length === 1 ? 'opção' : 'opções'}
        </span>
        {maxOdd > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
            até ×{maxOdd.toFixed(2)} <CoinIcon size={12} />
          </span>
        )}
      </div>
    </Link>
  );
}
