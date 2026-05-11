import type { BracketFase } from '@/types';
import MatchupCard from './MatchupCard';

interface Props {
  fase: BracketFase;
}

export default function BracketFaseView({ fase }: Props) {
  if (fase.partidas.length === 0) return null;

  const done = fase.partidas.filter((p) => p.status === 'finalizado').length;
  const total = fase.partidas.length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-base font-semibold text-gray-800">{fase.nome}</h2>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
          {done}/{total} concluídos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {fase.partidas.map((partida) => (
          <MatchupCard key={`${fase.id}-${partida.id}`} partida={partida} />
        ))}
      </div>
    </section>
  );
}
