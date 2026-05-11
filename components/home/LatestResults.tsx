import Image from 'next/image';
import Link from 'next/link';
import { getLatestFinishedMatches } from '@/lib/data/partidas';
import { getDelegacaoById } from '@/lib/data/delegacoes';

export default function LatestResults() {
  const matches = getLatestFinishedMatches(4);

  return (
    <section className="py-14 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Últimos Resultados</h2>
            <p className="text-sm text-gray-400 mt-0.5">Partidas recentes</p>
          </div>
          <Link href="/partidas" className="text-sm text-accent font-medium hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matches.length === 0 && (
            <p className="text-sm text-gray-400 col-span-2">Nenhuma partida finalizada ainda.</p>
          )}

          {matches.map((match) => {
            const a = getDelegacaoById(match.equipaA.delegacao);
            const b = getDelegacaoById(match.equipaB.delegacao);
            if (!a || !b) return null;
            const winnerA = match.equipaA.placar > match.equipaB.placar;
            const winnerB = match.equipaB.placar > match.equipaA.placar;

            return (
              <div
                key={match.id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow"
              >
                {/* Modality badge */}
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  {match.modalidade}
                </span>

                {/* Match row */}
                <div className="flex items-center justify-between mt-3 gap-3">
                  {/* Team A */}
                  <div className={`flex flex-col items-center gap-1.5 flex-1 ${winnerA ? '' : 'opacity-50'}`}>
                    <Image
                      src={a.flagUrl}
                      alt={a.nome}
                      width={40}
                      height={27}
                      className="flag-img w-10 h-[27px]"
                      unoptimized
                    />
                    <p className="text-xs font-semibold text-gray-700 text-center leading-tight">
                      {match.equipaA.jogador}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xl font-bold tabular-nums ${winnerA ? 'text-gray-900' : 'text-gray-400'}`}>
                      {match.equipaA.placar}
                    </span>
                    <span className="text-gray-200 font-light">—</span>
                    <span className={`text-xl font-bold tabular-nums ${winnerB ? 'text-gray-900' : 'text-gray-400'}`}>
                      {match.equipaB.placar}
                    </span>
                  </div>

                  {/* Team B */}
                  <div className={`flex flex-col items-center gap-1.5 flex-1 ${winnerB ? '' : 'opacity-50'}`}>
                    <Image
                      src={b.flagUrl}
                      alt={b.nome}
                      width={40}
                      height={27}
                      className="flag-img w-10 h-[27px]"
                      unoptimized
                    />
                    <p className="text-xs font-semibold text-gray-700 text-center leading-tight">
                      {match.equipaB.jogador}
                    </p>
                  </div>
                </div>

                {/* MVP */}
                {match.mvp && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    MVP: <span className="text-gray-600 font-medium">{match.mvp}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
