'use client';

import { useState } from 'react';
import { LayoutList, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import BracketFaseView from '@/components/chaveamento/BracketFaseView';
import BracketTreeView from '@/components/chaveamento/BracketTreeView';
import type { BracketFase } from '@/types';

type View = 'list' | 'tree';

export default function ChaveamentoPageClient({ fases }: { fases: BracketFase[] }) {
  const [view, setView] = useState<View>('list');

  const fasesAtivas = fases.filter(f => f.partidas.length > 0 || (f.equipes && f.equipes.length > 0));

  // Tree view only makes sense for bracket-style phases (partidas, no equipes)
  const hasBracket = fases.some(f => f.partidas.length > 0 && !f.equipes);

  return (
    <>
      {/* View toggle — only show tree option when there is a bracket */}
      {fasesAtivas.length > 0 && (
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setView('list')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
              view === 'list'
                ? 'bg-accent-light text-accent border-accent/20'
                : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            )}
          >
            <LayoutList className="w-4 h-4" />
            Lista
          </button>

          {hasBracket && (
            <button
              onClick={() => setView('tree')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                view === 'tree'
                  ? 'bg-accent-light text-accent border-accent/20'
                  : 'text-gray-500 border-gray-200 hover:bg-gray-50'
              )}
            >
              <GitBranch className="w-4 h-4" />
              Chaveamento
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {fasesAtivas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>Nenhuma partida registrada ainda.</p>
        </div>
      ) : view === 'list' ? (
        <div className="flex flex-col gap-10">
          {fasesAtivas.map(fase => (
            <BracketFaseView key={fase.id} fase={fase} />
          ))}
        </div>
      ) : (
        <BracketTreeView fases={fases} />
      )}
    </>
  );
}
