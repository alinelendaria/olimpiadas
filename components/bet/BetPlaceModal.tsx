'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BetEvent, BetOption, BetUser } from '@/types/bet';

interface Props {
  event: BetEvent;
  profile: BetUser;
  onClose: () => void;
  onSuccess: (profile: BetUser) => void;
}

export default function BetPlaceModal({ event, profile, onClose, onSuccess }: Props) {
  const [selectedOption, setSelectedOption] = useState<BetOption | null>(null);
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const options  = event.bet_options ?? [];
  const valorNum = parseInt(valor) || 0;
  const retorno  = selectedOption ? Math.floor(valorNum * Number(selectedOption.odd)) : 0;
  const lucro    = retorno - valorNum;

  async function handleSubmit() {
    if (!selectedOption || valorNum < 1) return;
    if (valorNum > profile.saldo) { setError('Saldo insuficiente'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/bet/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, option_id: selectedOption.id, valor: valorNum }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erro ao apostar'); return; }
      onSuccess(data.profile);
    } finally {
      setLoading(false);
    }
  }

  const presets = [50, 100, 200, 500].filter(v => v <= profile.saldo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Apostar em</p>
            <h2 className="font-bold text-gray-900 text-sm leading-tight">{event.titulo}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Saldo */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
            <span className="text-xs text-amber-700 font-medium">Seu saldo</span>
            <span className="text-sm font-bold text-amber-800">🪙 {profile.saldo.toLocaleString()}</span>
          </div>

          {/* Opções */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Escolha uma opção</p>
            <div className="space-y-2">
              {options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-colors',
                    selectedOption?.id === opt.id
                      ? 'bg-accent-light border-accent/40 text-accent font-semibold'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-200'
                  )}
                >
                  <span>{opt.texto}</span>
                  <span className={cn('text-xs font-bold', selectedOption?.id === opt.id ? 'text-accent' : 'text-amber-600')}>
                    ×{Number(opt.odd).toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Valor */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Quantidade de moedas</p>
            <div className="flex gap-1.5 mb-2">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setValor(String(p))}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    Number(valor) === p
                      ? 'bg-accent text-white border-accent'
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setValor(String(profile.saldo))}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium border bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200 transition-colors"
              >
                Tudo
              </button>
            </div>
            <input
              type="number"
              value={valor}
              onChange={e => setValor(e.target.value)}
              min={1}
              max={profile.saldo}
              placeholder="Valor personalizado"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Preview retorno */}
          {selectedOption && valorNum > 0 && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <span className="block">Retorno possível</span>
                <span className="text-[11px]">se {selectedOption.texto} vencer</span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-gray-900">🪙 {retorno.toLocaleString()}</span>
                <span className={cn('text-[11px] font-medium', lucro > 0 ? 'text-green-600' : 'text-red-500')}>
                  {lucro > 0 ? '+' : ''}{lucro.toLocaleString()} moedas
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!selectedOption || valorNum < 1 || loading}
            className="w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : `Apostar 🪙 ${valorNum > 0 ? valorNum.toLocaleString() : '—'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
