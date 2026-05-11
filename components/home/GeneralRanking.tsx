import Image from 'next/image';
import Link from 'next/link';
import { DELEGACOES } from '@/lib/data/delegacoes';
import { buildRankingFromDelegacoes } from '@/lib/utils';

export default function GeneralRanking() {
  const ranking = buildRankingFromDelegacoes(DELEGACOES).slice(0, 5);

  return (
    <section className="py-14 bg-subtle border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quadro de Medalhas</h2>
            <p className="text-sm text-gray-400 mt-0.5">Classificação geral por país</p>
          </div>
          <Link href="/medalhas" className="text-sm text-accent font-medium hover:underline">
            Ver completo →
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-card">
          {/* Header */}
          <div className="grid grid-cols-[32px_1fr_56px_56px_56px_56px] gap-2 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-400 font-medium text-center">#</span>
            <span className="text-xs text-gray-400 font-medium">País</span>
            <span className="text-xs text-gray-400 font-medium text-center">🥇</span>
            <span className="text-xs text-gray-400 font-medium text-center">🥈</span>
            <span className="text-xs text-gray-400 font-medium text-center">🥉</span>
            <span className="text-xs text-gray-400 font-medium text-center">Total</span>
          </div>

          {/* Rows */}
          {ranking.map((entry, i) => (
            <div
              key={entry.country.id}
              className={`grid grid-cols-[32px_1fr_56px_56px_56px_56px] gap-2 px-4 sm:px-6 py-3.5 items-center border-b border-gray-50 last:border-0 ${i === 0 ? 'rank-1' : ''}`}
            >
              <span className="text-sm font-semibold text-gray-400 text-center">{i + 1}</span>

              <div className="flex items-center gap-2.5 min-w-0">
                <Image
                  src={entry.country.flagUrl}
                  alt={entry.country.nome}
                  width={28}
                  height={19}
                  className="flag-img w-7 h-[19px] shrink-0"
                  unoptimized
                />
                <span className="text-sm font-medium text-gray-800 truncate">{entry.country.nome}</span>
              </div>

              <span className="text-sm font-semibold text-center medal-gold tabular-nums">{entry.gold}</span>
              <span className="text-sm font-semibold text-center medal-silver tabular-nums">{entry.silver}</span>
              <span className="text-sm font-semibold text-center medal-bronze tabular-nums">{entry.bronze}</span>
              <span className="text-sm font-medium text-gray-600 text-center tabular-nums">{entry.total}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
