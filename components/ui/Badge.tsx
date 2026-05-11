import { cn } from '@/lib/utils';
import type { MatchStatus, MedalType } from '@/types';

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === 'live') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-100',
          className
        )}
      >
        <span className="live-dot" style={{ width: 6, height: 6 }} />
        Ao Vivo
      </span>
    );
  }

  if (status === 'scheduled') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100',
          className
        )}
      >
        Agendado
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-green-700 bg-green-50 border border-green-100',
        className
      )}
    >
      Finalizado
    </span>
  );
}

// ─── Medal Badge ──────────────────────────────────────────────────────────────

interface MedalBadgeProps {
  type: MedalType;
  count?: number;
  className?: string;
}

const medalConfig: Record<MedalType, { emoji: string; className: string }> = {
  gold:   { emoji: '🥇', className: 'text-amber-600 bg-amber-50 border-amber-200' },
  silver: { emoji: '🥈', className: 'text-gray-500 bg-gray-100 border-gray-200' },
  bronze: { emoji: '🥉', className: 'text-orange-700 bg-orange-50 border-orange-200' },
};

export function MedalBadge({ type, count, className }: MedalBadgeProps) {
  const config = medalConfig[type];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border',
        config.className,
        className
      )}
    >
      {config.emoji}
      {count !== undefined && <span>{count}</span>}
    </span>
  );
}

// ─── Modality Status Badge ────────────────────────────────────────────────────

interface ModalityBadgeProps {
  status: 'aguardando' | 'em_andamento' | 'finalizado';
  className?: string;
}

export function ModalityBadge({ status, className }: ModalityBadgeProps) {
  if (status === 'em_andamento') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-50 border border-green-100',
          className
        )}
      >
        <span className="live-dot" style={{ width: 6, height: 6 }} />
        Em Andamento
      </span>
    );
  }

  if (status === 'finalizado') {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100',
          className
        )}
      >
        Finalizado
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100',
        className
      )}
    >
      Aguardando
    </span>
  );
}
