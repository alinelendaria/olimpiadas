import Image from 'next/image';
import Link from 'next/link';
import { DELEGACOES } from '@/lib/data/delegacoes';

export default function DelegationsHighlight() {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Delegações</h2>
            <p className="text-sm text-gray-400 mt-0.5">9 países participantes</p>
          </div>
          <Link href="/delegacoes" className="text-sm text-accent font-medium hover:underline">
            Ver todas →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {DELEGACOES.map((d) => (
            <Link
              key={d.id}
              href="/delegacoes"
              className="flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-card-hover transition-all duration-200 group"
            >
              <Image
                src={d.flagUrl}
                alt={d.nome}
                width={40}
                height={27}
                className="flag-img w-10 h-[27px] shrink-0"
                unoptimized
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{d.nome}</p>
                <p className="text-xs text-gray-400">{d.jogadores.length} atletas</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
