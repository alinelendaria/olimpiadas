import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { BracketPartida, BracketJogador } from '@/types';

function PlayerSlot({
  jogador,
  side,
  isWinner,
  isLoser,
  placeholder,
}: {
  jogador: BracketJogador | null;
  side: 'left' | 'right';
  isWinner: boolean;
  isLoser: boolean;
  placeholder?: string;
}) {
  const base = cn(
    'flex items-center gap-1.5 min-w-0',
    side === 'right' && 'flex-row-reverse',
    isWinner && 'font-semibold',
    isLoser && 'opacity-35'
  );

  if (!jogador) {
    return (
      <div className={base}>
        <div className="w-5 h-3.5 bg-gray-100 rounded-sm shrink-0" />
        <span className="text-xs text-gray-300 italic truncate">{placeholder ?? 'A definir'}</span>
      </div>
    );
  }

  return (
    <div className={base}>
      <Image
        src={`https://flagcdn.com/w40/${jogador.delegacao}.png`}
        alt={jogador.delegacao}
        width={20}
        height={14}
        unoptimized
        className="flag-img shrink-0"
      />
      <span className={cn('text-sm truncate', isWinner ? 'text-green-700' : 'text-gray-800')}>
        {jogador.nome}
      </span>
      {isWinner && <span className="text-green-500 text-[10px] shrink-0">✓</span>}
    </div>
  );
}

interface Props {
  partida: BracketPartida;
}

export default function MatchupCard({ partida }: Props) {
  const { id, jogador1, jogador2, jogador2FromRep, jogador1FromFase, jogador2FromFase, vencedor, status, placar1, placar2 } = partida;
  const isDone = status === 'finalizado';
  const hasScore = placar1 !== null && placar2 !== null;

  const j1Placeholder = jogador1FromFase ? `Venc. #${jogador1FromFase.partidaId}` : 'A definir';
  const j2Placeholder = jogador2FromFase
    ? `Venc. #${jogador2FromFase.partidaId}`
    : jogador2FromRep
    ? `Venc. #${jogador2FromRep}`
    : 'A definir';

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-card px-3 py-2.5">
      {/* Match number + status */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] font-mono text-gray-300">#{id}</span>
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            isDone ? 'bg-green-400' : status === 'ao_vivo' ? 'bg-red-400' : 'bg-gray-200'
          )}
        />
      </div>

      {/* Players row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <PlayerSlot jogador={jogador1} side="left" isWinner={vencedor === 1} isLoser={vencedor === 2} placeholder={j1Placeholder} />
        </div>

        {/* Score or separator */}
        <div className="shrink-0 text-center min-w-[40px]">
          {hasScore ? (
            <span className="text-sm font-bold text-gray-900 tabular-nums">
              {placar1} × {placar2}
            </span>
          ) : (
            <span className="text-[11px] text-gray-300">×</span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex justify-end">
          <PlayerSlot
            jogador={jogador2}
            side="right"
            isWinner={vencedor === 2}
            isLoser={vencedor === 1}
            placeholder={j2Placeholder}
          />
        </div>
      </div>
    </div>
  );
}
