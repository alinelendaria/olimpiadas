'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Delegacao } from '@/types';

interface Props {
  delegacao: Delegacao;
}

export default function DelegationCard({ delegacao: d }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200">
      {/* Header */}
      <div className="p-5 flex items-center gap-4">
        <Image
          src={d.flagUrl}
          alt={d.nome}
          width={64}
          height={43}
          className="flag-img w-16 h-[43px] shrink-0"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900 truncate">{d.nome}</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded shrink-0">
              {d.codigo}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{d.jogadores.length} atletas</p>
        </div>
      </div>

      {/* Medals row */}
      <div className="px-5 pb-4 flex items-center gap-5 border-b border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🥇</span>
          <span className="text-sm font-semibold medal-gold tabular-nums">{d.medalhas.ouro}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base">🥈</span>
          <span className="text-sm font-semibold medal-silver tabular-nums">{d.medalhas.prata}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base">🥉</span>
          <span className="text-sm font-semibold medal-bronze tabular-nums">{d.medalhas.bronze}</span>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          {d.medalhas.ouro + d.medalhas.prata + d.medalhas.bronze} medalhas
        </div>
      </div>

      {/* Players toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors rounded-b-xl"
      >
        <span>Ver atletas</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Player list */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 py-4 flex flex-wrap gap-2 rounded-b-xl bg-gray-50">
          {d.jogadores.map((jogador) => (
            <span
              key={jogador}
              className="text-xs font-medium text-gray-700 bg-white border border-gray-100 px-2.5 py-1 rounded-full"
            >
              {jogador}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
