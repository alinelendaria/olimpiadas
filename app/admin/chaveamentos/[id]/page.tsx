'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { getChaveamentoById, applyResults } from '@/lib/data/chaveamentos';
import type { Chaveamento, BracketPartida, BracketJogador } from '@/types';
import { cn } from '@/lib/utils';

function FlagImg({ delegacao }: { delegacao: string }) {
  return (
    <Image
      src={`https://flagcdn.com/w40/${delegacao}.png`}
      alt={delegacao}
      width={20}
      height={13}
      unoptimized
      className="flag-img shrink-0"
    />
  );
}

function MatchRow({
  partida,
  faseId,
  onUpdate,
  savingKey,
}: {
  partida: BracketPartida;
  faseId: string;
  onUpdate: (faseId: string, partidaId: number, vencedor: 1 | 2 | null, p1: number, p2: number) => void;
  savingKey: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [placar1, setPlacar1] = useState(partida.placar1 ?? 0);
  const [placar2, setPlacar2] = useState(partida.placar2 ?? 0);

  useEffect(() => {
    setPlacar1(partida.placar1 ?? 0);
    setPlacar2(partida.placar2 ?? 0);
  }, [partida.placar1, partida.placar2]);

  const key = `${faseId}-${partida.id}`;
  const isBusy = savingKey === key;
  const isDone = partida.status === 'finalizado';
  const hasScore = partida.placar1 !== null && partida.placar2 !== null;

  const p1Name = partida.jogador1?.nome ?? 'A definir';
  const p2Name = partida.jogador2?.nome
    ?? (partida.jogador2FromRep ? `Vencedor #${partida.jogador2FromRep}` : 'A definir');
  const p2Ref = partida.jogador2FromFase
    ? `Venc. ${partida.jogador2FromFase.faseId} #${partida.jogador2FromFase.partidaId}`
    : partida.jogador1FromFase
    ? `Venc. ${partida.jogador1FromFase.faseId} #${partida.jogador1FromFase.partidaId}`
    : null;

  const canEdit = !!partida.jogador1;

  return (
    <div className={cn('bg-white border rounded-xl shadow-card overflow-hidden', isDone && 'border-green-100')}>
      {/* Header row */}
      <button
        onClick={() => canEdit && setOpen(!open)}
        disabled={!canEdit}
        className={cn(
          'w-full px-4 py-3 flex items-center gap-3 text-left transition-colors',
          canEdit ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default opacity-60'
        )}
      >
        <span className="text-[10px] font-mono text-gray-400 w-5 shrink-0">#{partida.id}</span>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {partida.jogador1 && <FlagImg delegacao={partida.jogador1.delegacao} />}
          <span className={cn('text-sm truncate', partida.vencedor === 1 && 'font-semibold text-green-700')}>
            {p1Name}
          </span>

          <span className="text-xs text-gray-400 shrink-0 mx-1">
            {hasScore ? `${partida.placar1} × ${partida.placar2}` : '×'}
          </span>

          <span className={cn('text-sm truncate', partida.vencedor === 2 && 'font-semibold text-green-700')}>
            {partida.jogador2 ? (
              <>
                <span className="hidden sm:inline">{partida.jogador2.nome}</span>
                <span className="sm:hidden">{partida.jogador2.nome.split(' ')[0]}</span>
              </>
            ) : (
              <span className="text-gray-300 italic text-xs">{p2Name}</span>
            )}
          </span>
          {partida.jogador2 && <FlagImg delegacao={partida.jogador2.delegacao} />}
        </div>

        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0',
          isDone ? 'text-green-700 bg-green-50' : 'text-gray-400 bg-gray-50'
        )}>
          {isDone ? 'Concluído' : 'Pendente'}
        </span>

        {canEdit && (
          <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform', open && 'rotate-180')} />
        )}
      </button>

      {/* Expanded editor */}
      {open && canEdit && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {/* Score inputs */}
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-medium">Placar</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              {partida.jogador1 && (
                <p className="text-[10px] text-gray-500 mb-1 truncate">{partida.jogador1.nome}</p>
              )}
              <input
                type="number"
                min={0}
                value={placar1}
                onChange={(e) => setPlacar1(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <span className="text-gray-400 text-lg font-medium mt-4">×</span>
            <div className="flex-1">
              {partida.jogador2 && (
                <p className="text-[10px] text-gray-500 mb-1 truncate">{partida.jogador2.nome}</p>
              )}
              <input
                type="number"
                min={0}
                value={placar2}
                onChange={(e) => setPlacar2(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Winner selection */}
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-medium">Vencedor</p>
          <div className="flex gap-2 mb-3">
            {/* Player 1 button */}
            <button
              onClick={() => onUpdate(faseId, partida.id, 1, placar1, placar2)}
              disabled={isBusy || !partida.jogador1}
              className={cn(
                'flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                partida.vencedor === 1
                  ? 'border-green-300 bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-accent hover:bg-accent-light'
              )}
            >
              {partida.jogador1 && <FlagImg delegacao={partida.jogador1.delegacao} />}
              <span className="truncate">{p1Name}</span>
              {partida.vencedor === 1 && <span className="ml-auto text-green-500 text-xs">✓</span>}
            </button>

            {/* Player 2 button */}
            <button
              onClick={() => onUpdate(faseId, partida.id, 2, placar1, placar2)}
              disabled={isBusy || !partida.jogador2}
              className={cn(
                'flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                partida.vencedor === 2
                  ? 'border-green-300 bg-green-50 text-green-700 ring-1 ring-green-200'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-accent hover:bg-accent-light',
                !partida.jogador2 && 'opacity-40 cursor-not-allowed'
              )}
            >
              {partida.jogador2 && <FlagImg delegacao={partida.jogador2.delegacao} />}
              <span className="truncate">{p2Name}</span>
              {partida.vencedor === 2 && <span className="ml-auto text-green-500 text-xs">✓</span>}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isBusy && <span className="text-xs text-gray-400">Salvando...</span>}
            {partida.vencedor && !isBusy && (
              <button
                onClick={() => onUpdate(faseId, partida.id, null, 0, 0)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Desfazer resultado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminChaveamentoEditor() {
  const { id } = useParams<{ id: string }>();
  const [chaveamento, setChaveamento] = useState<Chaveamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const base = getChaveamentoById(id);
    if (!base) { setLoading(false); return; }

    try {
      const res = await fetch(`/api/brackets/${id}`);
      const json = await res.json();
      const merged = applyResults(base, json.results ?? []);
      setChaveamento(merged);
      if (!activeTab) {
        const first = merged.fases.find((f) => f.partidas.length > 0);
        if (first) setActiveTab(first.id);
      }
    } catch {
      setChaveamento(base);
    } finally {
      setLoading(false);
    }
  }, [id, activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleUpdate = async (
    faseId: string, partidaId: number, vencedor: 1 | 2 | null, placar1: number, placar2: number
  ) => {
    const key = `${faseId}-${partidaId}`;
    setSavingKey(key);
    setError(null);

    try {
      const res = await fetch('/api/brackets/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chaveamento_id: id,
          fase_id: faseId,
          partida_id: partidaId,
          vencedor,
          placar1: vencedor ? placar1 : null,
          placar2: vencedor ? placar2 : null,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Erro ao salvar');
      await loadData();
    } catch (err) {
      setError(String(err));
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) return <div className="text-sm text-gray-400 py-12 text-center">Carregando...</div>;

  if (!chaveamento) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Chaveamento não encontrado.</p>
        <Link href="/admin/chaveamentos" className="text-accent text-sm hover:underline mt-2 inline-block">← Voltar</Link>
      </div>
    );
  }

  const fasesAtivas = chaveamento.fases.filter((f) => f.partidas.length > 0);
  const faseAtual = fasesAtivas.find((f) => f.id === activeTab) ?? fasesAtivas[0];

  const totalDone = fasesAtivas.reduce((acc, f) => acc + f.partidas.filter((p) => p.status === 'finalizado').length, 0);
  const totalAll = fasesAtivas.reduce((acc, f) => acc + f.partidas.length, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/admin/chaveamentos" className="text-accent hover:underline">← Chaveamentos</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">{chaveamento.nome}</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{chaveamento.icone}</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{chaveamento.nome}</h1>
          <p className="text-sm text-gray-500">{totalDone}/{totalAll} partidas concluídas</p>
        </div>
      </div>

      {error && (
        <div className="my-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Phase tabs */}
      <div className="flex gap-1 my-5 flex-wrap">
        {fasesAtivas.map((fase) => {
          const done = fase.partidas.filter((p) => p.status === 'finalizado').length;
          const isActive = activeTab === fase.id;
          return (
            <button
              key={fase.id}
              onClick={() => setActiveTab(fase.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {fase.nome}
              <span className={cn('ml-1.5 text-[11px]', isActive ? 'text-blue-200' : 'text-gray-400')}>
                {done}/{fase.partidas.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Match list */}
      {faseAtual && (
        <div className="flex flex-col gap-2">
          {faseAtual.partidas.map((partida) => (
            <MatchRow
              key={partida.id}
              partida={partida}
              faseId={faseAtual.id}
              onUpdate={handleUpdate}
              savingKey={savingKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}
