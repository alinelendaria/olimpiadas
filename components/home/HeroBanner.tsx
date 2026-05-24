'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { DELEGACOES } from '@/lib/data/delegacoes';
import { MODALIDADES } from '@/lib/data/modalidades';

const featured = DELEGACOES.slice(0, 6);

export default function HeroBanner() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left: text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest text-accent uppercase mb-4 bg-accent-light px-3 py-1 rounded-full">
              3ª Edição · 2026
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Olimpíadas{' '}
              <span className="text-accent">TDJ</span>
            </h1>

            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              9 delegações, {MODALIDADES.length} modalidades e dezenas de atletas disputando a glória olímpica no Haxball.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/delegacoes"
                className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors"
              >
                Ver Delegações
              </Link>
              <Link
                href="/medalhas"
                className="px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Quadro de Medalhas
              </Link>
              <Link
                href="/ao-vivo"
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
              >
                <span className="live-dot" />
                Ao Vivo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
              {[
                { value: '9',   label: 'Delegações' },
                { value: '70+', label: 'Atletas' },
                { value: String(MODALIDADES.length), label: 'Modalidades' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: flag grid */}
          <motion.div
            className="flex-1 max-w-sm lg:max-w-none w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="grid grid-cols-3 gap-3">
              {featured.map((d) => (
                <Link
                  key={d.id}
                  href="/delegacoes"
                  className="group relative bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-gray-200 hover:shadow-card-hover transition-all duration-200"
                >
                  <Image
                    src={d.flagUrl}
                    alt={d.nome}
                    width={56}
                    height={38}
                    className="flag-img w-14 h-9"
                    unoptimized
                  />
                  <span className="text-xs font-semibold text-gray-600 text-center leading-tight">{d.nome}</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              + Paraguai, Turquia, Cuba e Delegação Independente
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
