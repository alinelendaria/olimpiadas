'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { DELEGACOES } from '@/lib/data/delegacoes';
import { buildRankingFromDelegacoes } from '@/lib/utils';

type SortKey = 'gold' | 'silver' | 'bronze' | 'total' | 'points';

export default function MedalTable() {
  const [sortKey, setSortKey] = useState<SortKey>('gold');

  const ranking = buildRankingFromDelegacoes(DELEGACOES).sort((a, b) => {
    if (sortKey === 'gold') {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    }
    if (sortKey === 'silver') return b.silver !== a.silver ? b.silver - a.silver : b.gold - a.gold;
    if (sortKey === 'bronze') return b.bronze !== a.bronze ? b.bronze - a.bronze : b.gold - a.gold;
    if (sortKey === 'total') return b.total - a.total;
    return b.points - a.points;
  });

  const Col = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => setSortKey(k)}
      className={`text-xs font-medium text-center w-full transition-colors ${
        sortKey === k ? 'text-accent' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}{sortKey === k ? ' ↓' : ''}
    </button>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[36px_1fr_60px_60px_60px_60px_60px] gap-2 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-400 font-medium text-center">#</span>
        <span className="text-xs text-gray-400 font-medium">País</span>
        <Col k="gold"   label="🥇 Ouro" />
        <Col k="silver" label="🥈 Prata" />
        <Col k="bronze" label="🥉 Bronze" />
        <Col k="total"  label="Total" />
        <Col k="points" label="Pts" />
      </div>

      <AnimatePresence mode="popLayout">
        {ranking.map((entry, i) => {
          const pos = i + 1;
          return (
            <motion.div
              key={entry.country.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`grid grid-cols-[36px_1fr_60px_60px_60px_60px_60px] gap-2 px-4 sm:px-6 py-4 items-center border-b border-gray-50 last:border-0 ${
                pos === 1 ? 'rank-1' : pos === 2 ? 'rank-2' : pos === 3 ? 'rank-3' : ''
              }`}
            >
              {/* Position */}
              <span
                className={`text-sm font-bold text-center tabular-nums ${
                  pos === 1 ? 'medal-gold' : pos === 2 ? 'medal-silver' : pos === 3 ? 'medal-bronze' : 'text-gray-400'
                }`}
              >
                {pos}
              </span>

              {/* Country */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Image
                  src={entry.country.flagUrl}
                  alt={entry.country.nome}
                  width={32}
                  height={22}
                  className="flag-img w-8 h-[22px] shrink-0"
                  unoptimized
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{entry.country.nome}</p>
                  <p className="text-xs text-gray-400">{entry.country.codigo}</p>
                </div>
              </div>

              {/* Medals */}
              <span className="text-sm font-bold text-center tabular-nums medal-gold">{entry.gold}</span>
              <span className="text-sm font-bold text-center tabular-nums medal-silver">{entry.silver}</span>
              <span className="text-sm font-bold text-center tabular-nums medal-bronze">{entry.bronze}</span>
              <span className="text-sm font-medium text-center tabular-nums text-gray-600">{entry.total}</span>
              <span className="text-sm font-semibold text-center tabular-nums text-accent">{entry.points}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
