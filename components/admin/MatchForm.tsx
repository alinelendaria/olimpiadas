'use client';

import { useState } from 'react';
import { DELEGACOES } from '@/lib/data/delegacoes';
import { CHAVEAMENTOS } from '@/lib/data/chaveamentos';
import type { AdminMatchFormData } from '@/types';

interface MatchFormProps {
  onSuccess?: () => void;
}

const INITIAL_FORM: AdminMatchFormData = {
  modalidade: '',
  delegacaoA: '',
  jogadorA: '',
  delegacaoB: '',
  jogadorB: '',
  placarA: 0,
  placarB: 0,
  status: 'finished',
  mvp: '',
  data: new Date().toISOString().slice(0, 16),
  link: '',
};

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent bg-white text-gray-800 transition-colors';

export default function MatchForm({ onSuccess }: MatchFormProps) {
  const [form, setForm]       = useState<AdminMatchFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const delegA = DELEGACOES.find((d) => d.id === form.delegacaoA);
  const delegB = DELEGACOES.find((d) => d.id === form.delegacaoB);

  const set = (field: keyof AdminMatchFormData, value: string | number) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/partidas/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? 'Erro ao salvar');
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => { setSuccess(false); setForm(INITIAL_FORM); }, 2500);
    } catch (err) {
      setError(String(err).replace('Error: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Modality */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">Modalidade *</label>
        <select required value={form.modalidade} onChange={(e) => set('modalidade', e.target.value)} className={inputCls}>
          <option value="">Selecionar modalidade</option>
          {CHAVEAMENTOS.map((c) => <option key={c.id} value={c.nome}>{c.icone} {c.nome}</option>)}
        </select>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team A */}
        <div className="space-y-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="text-xs font-bold text-blue-700 uppercase tracking-widest">Jogador A</h3>
          <select required value={form.delegacaoA} onChange={(e) => { set('delegacaoA', e.target.value); set('jogadorA', ''); }} className={inputCls}>
            <option value="">País</option>
            {DELEGACOES.map((d) => <option key={d.id} value={d.id}>{d.bandeira} {d.nome}</option>)}
          </select>
          <select required value={form.jogadorA} onChange={(e) => set('jogadorA', e.target.value)} disabled={!delegA} className={`${inputCls} disabled:opacity-50`}>
            <option value="">Jogador</option>
            {delegA?.jogadores.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
          <input type="number" min={0} value={form.placarA} onChange={(e) => set('placarA', parseInt(e.target.value) || 0)} className={inputCls} placeholder="Placar A" />
        </div>

        {/* Team B */}
        <div className="space-y-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest">Jogador B</h3>
          <select required value={form.delegacaoB} onChange={(e) => { set('delegacaoB', e.target.value); set('jogadorB', ''); }} className={inputCls}>
            <option value="">País</option>
            {DELEGACOES.map((d) => <option key={d.id} value={d.id}>{d.bandeira} {d.nome}</option>)}
          </select>
          <select required value={form.jogadorB} onChange={(e) => set('jogadorB', e.target.value)} disabled={!delegB} className={`${inputCls} disabled:opacity-50`}>
            <option value="">Jogador</option>
            {delegB?.jogadores.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
          <input type="number" min={0} value={form.placarB} onChange={(e) => set('placarB', parseInt(e.target.value) || 0)} className={inputCls} placeholder="Placar B" />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
        <div className="flex gap-2">
          {(['scheduled', 'live', 'finished'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set('status', s)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                form.status === s
                  ? s === 'live'     ? 'bg-red-100 text-red-700 border-red-200'
                  : s === 'finished' ? 'bg-green-100 text-green-700 border-green-200'
                                     : 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
              }`}
            >
              {s === 'live' ? '🔴 Ao Vivo' : s === 'finished' ? '✅ Finalizado' : '📅 Agendado'}
            </button>
          ))}
        </div>
      </div>

      {/* MVP + Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">MVP</label>
          <input type="text" value={form.mvp} onChange={(e) => set('mvp', e.target.value)} placeholder="Nome do MVP" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">Data/Hora</label>
          <input type="datetime-local" value={form.data} onChange={(e) => set('data', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Link */}
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-1.5">Link do Replay (opcional)</label>
        <input type="url" value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" className={inputCls} />
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
          success   ? 'bg-green-600 text-white' :
          loading   ? 'bg-accent/40 text-white cursor-wait' :
                      'bg-accent text-white hover:bg-accent-hover'
        }`}
      >
        {success ? '✅ Partida registrada!' : loading ? 'Salvando…' : 'Registrar Partida'}
      </button>
    </form>
  );
}
