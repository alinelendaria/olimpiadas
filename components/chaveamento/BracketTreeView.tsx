'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { BracketFase, BracketPartida, BracketJogador } from '@/types';

// ── Layout constants ───────────────────────────────────────────
const SLOT_H  = 100;  // vertical height per slot in base round (px)
const CARD_H  = 72;   // estimated card height for SVG connector positioning (px)
const CARD_W  = 176;  // fixed card width (px)
const COL_GAP = 44;   // horizontal gap between columns (for connectors)
const HDR_H   = 28;   // header (phase name) height

// ── Helpers ───────────────────────────────────────────────────
function matchCenter(roundIdx: number, matchIdx: number) {
  return (matchIdx + 0.5) * SLOT_H * Math.pow(2, roundIdx);
}
function matchTop(roundIdx: number, matchIdx: number) {
  return matchCenter(roundIdx, matchIdx) - CARD_H / 2;
}

// ── Sub-components ────────────────────────────────────────────
function PlayerRow({
  jogador, placeholder, isWinner, isLoser,
}: {
  jogador: BracketJogador | null;
  placeholder: string;
  isWinner: boolean;
  isLoser: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-1.5 px-2 py-1.5', isLoser && 'opacity-35')}>
      {jogador ? (
        <>
          <Image
            src={`https://flagcdn.com/w40/${jogador.delegacao}.png`}
            alt={jogador.delegacao}
            width={14} height={10}
            unoptimized
            className="shrink-0"
          />
          <span className={cn('text-[11px] truncate flex-1', isWinner ? 'font-semibold text-green-700' : 'text-gray-800')}>
            {jogador.nome}
          </span>
          {isWinner && <span className="text-green-500 text-[8px]">✓</span>}
        </>
      ) : (
        <>
          <div className="w-3.5 h-2 bg-gray-100 rounded-sm shrink-0" />
          <span className="text-[11px] text-gray-300 italic truncate">{placeholder}</span>
        </>
      )}
    </div>
  );
}

function TreeCard({ partida }: { partida: BracketPartida }) {
  const j1p = partida.jogador1FromFase
    ? `Venc. #${partida.jogador1FromFase.partidaId}`
    : 'A definir';
  const j2p = partida.jogador2FromFase
    ? `Venc. #${partida.jogador2FromFase.partidaId}`
    : partida.jogador2FromRep
    ? `Venc. #${partida.jogador2FromRep}`
    : 'A definir';

  return (
    <div
      className={cn(
        'bg-white border rounded-lg overflow-hidden shadow-sm',
        partida.status === 'ao_vivo' ? 'border-red-200' : 'border-gray-200'
      )}
      style={{ width: CARD_W }}
    >
      {/* header */}
      <div className="flex items-center gap-1 px-2 py-0.5">
        <span className="text-[9px] font-mono text-gray-300">#{partida.id}</span>
        <div className={cn('w-1.5 h-1.5 rounded-full shrink-0',
          partida.status === 'finalizado' ? 'bg-green-400' :
          partida.status === 'ao_vivo'    ? 'bg-red-400'   : 'bg-gray-200'
        )} />
        {partida.placar1 !== null && partida.placar2 !== null && (
          <span className="ml-auto text-[10px] font-bold text-gray-600 tabular-nums">
            {partida.placar1}×{partida.placar2}
          </span>
        )}
      </div>
      <div className="h-px bg-gray-100" />
      <PlayerRow
        jogador={partida.jogador1} placeholder={j1p}
        isWinner={partida.vencedor === 1} isLoser={partida.vencedor === 2}
      />
      <div className="h-px bg-gray-100" />
      <PlayerRow
        jogador={partida.jogador2} placeholder={j2p}
        isWinner={partida.vencedor === 2} isLoser={partida.vencedor === 1}
      />
    </div>
  );
}

// ── Mesa / Raia card (group-format phases: poker, natação…) ───
function MesaCard({ fase }: { fase: BracketFase }) {
  const equipes = fase.equipes ?? [];

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm shrink-0"
      style={{ width: CARD_W }}
    >
      {/* header */}
      <div className="bg-gray-50 border-b border-gray-100 px-2 py-1.5 text-center">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide truncate block">
          {fase.nome}
        </span>
      </div>

      {equipes.length === 0 ? (
        /* placeholder for final/semi not yet decided */
        <div className="flex items-center justify-center py-5 px-3">
          <span className="text-[11px] text-gray-300 italic text-center">A definir</span>
        </div>
      ) : (
        equipes.map((eq, i) => (
          <div
            key={eq.nome}
            className="flex items-center gap-1.5 px-2 py-[5px] border-b border-gray-50 last:border-0"
          >
            <span className="text-[9px] font-mono text-gray-300 w-4 shrink-0">{i + 1}</span>
            <Image
              src={`https://flagcdn.com/w40/${eq.delegacao}.png`}
              alt={eq.delegacao}
              width={14} height={10}
              unoptimized
              className="shrink-0"
            />
            <span className="text-[11px] text-gray-800 truncate flex-1">{eq.nome}</span>
          </div>
        ))
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function BracketTreeView({ fases }: { fases: BracketFase[] }) {
  const bracketPhases = fases.filter(f => f.partidas.length > 0 && !f.equipes);
  const equipePhases  = fases.filter(f => f.equipes !== undefined);

  // ── Group/mesa format (poker, natação, etc.) ──
  if (bracketPhases.length === 0 && equipePhases.length > 0) {
    return (
      <div className="overflow-x-auto pb-6 -mx-4 px-4">
        <div className="flex items-start gap-[44px]">
          {equipePhases.map(fase => (
            <MesaCard key={fase.id} fase={fase} />
          ))}
        </div>
      </div>
    );
  }

  // ── Standard bracket ──
  // skip group-stage phases (have equipes) and empty phases
  const phases = fases.filter(f => f.partidas.length > 0 && !f.equipes);

  if (phases.length === 0) return null;

  const maxMatches = Math.max(...phases.map(f => f.partidas.length));
  const totalH = maxMatches * SLOT_H;
  const totalW = phases.length * (CARD_W + COL_GAP) - COL_GAP;

  return (
    <div className="overflow-x-auto pb-6 -mx-4 px-4">
      <div className="relative" style={{ width: totalW, height: totalH + HDR_H }}>

        {/* Phase name headers */}
        {phases.map((fase, ci) => (
          <div
            key={fase.id + '-hdr'}
            className="absolute text-center text-xs font-semibold text-gray-500 truncate"
            style={{ left: ci * (CARD_W + COL_GAP), width: CARD_W, top: 0, height: HDR_H, lineHeight: `${HDR_H}px` }}
          >
            {fase.nome}
          </div>
        ))}

        {/* SVG connector lines */}
        <svg
          className="absolute pointer-events-none"
          style={{ top: HDR_H, left: 0 }}
          width={totalW}
          height={totalH}
        >
          {phases.map((fase, ci) => {
            const nextFase = phases[ci + 1];
            if (!nextFase) return null;

            // only draw bracket connectors when next phase has exactly half the matches
            if (fase.partidas.length !== nextFase.partidas.length * 2) return null;

            const riCurr = Math.log2(maxMatches / fase.partidas.length);
            const riNext = Math.log2(maxMatches / nextFase.partidas.length);

            return nextFase.partidas.map((_, parentIdx) => {
              const topIdx = parentIdx * 2;
              const botIdx = parentIdx * 2 + 1;

              const yTop = matchCenter(riCurr, topIdx);
              const yBot = matchCenter(riCurr, botIdx);
              const yMid = matchCenter(riNext, parentIdx);

              const x1   = ci * (CARD_W + COL_GAP) + CARD_W;
              const xMid = x1 + COL_GAP / 2;
              const x2   = (ci + 1) * (CARD_W + COL_GAP);

              return (
                <g key={`conn-${ci}-${parentIdx}`}>
                  {/* top card  →  mid vertical */}
                  <line x1={x1} y1={yTop} x2={xMid} y2={yTop} stroke="#d1d5db" strokeWidth="1.5" />
                  {/* bot card  →  mid vertical */}
                  <line x1={x1} y1={yBot} x2={xMid} y2={yBot} stroke="#d1d5db" strokeWidth="1.5" />
                  {/* vertical connector */}
                  <line x1={xMid} y1={yTop} x2={xMid} y2={yBot} stroke="#d1d5db" strokeWidth="1.5" />
                  {/* midpoint  →  next card */}
                  <line x1={xMid} y1={yMid} x2={x2} y2={yMid} stroke="#d1d5db" strokeWidth="1.5" />
                </g>
              );
            });
          })}
        </svg>

        {/* Match cards */}
        {phases.map((fase, ci) => {
          const ri = Math.log2(maxMatches / fase.partidas.length);
          return fase.partidas.map((partida, mi) => (
            <div
              key={`${fase.id}-${partida.id}`}
              className="absolute"
              style={{
                left: ci * (CARD_W + COL_GAP),
                top:  HDR_H + matchTop(ri, mi),
              }}
            >
              <TreeCard partida={partida} />
            </div>
          ));
        })}

      </div>
    </div>
  );
}
