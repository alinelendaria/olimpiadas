import HeroBanner from '@/components/home/HeroBanner';
import Countdown from '@/components/home/Countdown';
import DelegationsHighlight from '@/components/home/DelegationsHighlight';
import LatestResults from '@/components/home/LatestResults';
import GeneralRanking from '@/components/home/GeneralRanking';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <Countdown />
      <DelegationsHighlight />
      <LatestResults />
      <GeneralRanking />

      {/* MVP placeholder */}
      <section className="py-14 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-8 text-center">
            <span className="text-4xl mb-3 block">⭐</span>
            <h2 className="text-lg font-bold text-amber-900 mb-1">MVP da Semana</h2>
            <p className="text-sm text-amber-700">
              Será anunciado após as primeiras partidas. Fique ligado!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-100 bg-subtle">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Acompanhe todas as modalidades
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Resultados em tempo real, ranking de jogadores e o quadro de medalhas completo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/medalhas"
              className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors"
            >
              Ver Quadro de Medalhas
            </Link>
            <Link
              href="/ao-vivo"
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-100 bg-white rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="live-dot" />
              Ao Vivo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
