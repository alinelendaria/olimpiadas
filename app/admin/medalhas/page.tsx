'use client';

import { useState } from 'react';
import { DELEGACOES } from '@/lib/data/delegacoes';
import { MODALIDADES } from '@/lib/data/modalidades';
import type { AdminMedalFormData } from '@/types';

const INITIAL: AdminMedalFormData = { tipo: 'gold', delegacaoId: '', jogadorId: '', modalidadeId: '' };

const MEDAL_TYPES = [
  { value: 'gold'   as const, label: '🥇 Ouro',   color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'silver' as const, label: '🥈 Prata',  color: 'text-gray-500 bg-gray-100 border-gray-200' },
  { value: 'bronze' as const, label: '🥉 Bronze', color: 'text-orange-700 bg-orange-50 border-orange-200' },
];

export default function AdminMedalhasPage() {
  const [form, setForm]       = useState<AdminMedalFormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleg = DELEGACOES.find((d) => d.id === form.delegacaoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => { setSuccess(false); setForm(INITIAL); }, 2500);
  };

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent transition-colors bg-white text-gray-800';

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Atribuir Medalha</h1>
      <p className="text-sm text-gray-400 mb-8">Distribua medalhas aos vencedores de cada modalidade.</p>

      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Medal type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Tipo de Medalha *
            </label>
            <div className="flex gap-2">
              {MEDAL_TYPES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, tipo: m.value }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    form.tipo === m.value ? m.color : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Delegação *
            </label>
            <select
              required
              value={form.delegacaoId}
              onChange={(e) => setForm((p) => ({ ...p, delegacaoId: e.target.value, jogadorId: '' }))}
              className={inputCls}
            >
              <option value="">Selecionar delegação</option>
              {DELEGACOES.map((d) => (
                <option key={d.id} value={d.id}>{d.bandeira} {d.nome}</option>
              ))}
            </select>
          </div>

          {/* Player */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Atleta (opcional)
            </label>
            <select
              value={form.jogadorId}
              onChange={(e) => setForm((p) => ({ ...p, jogadorId: e.target.value }))}
              disabled={!deleg}
              className={`${inputCls} disabled:opacity-50`}
            >
              <option value="">Toda a delegação</option>
              {deleg?.jogadores.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          {/* Modality */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Modalidade *
            </label>
            <select
              required
              value={form.modalidadeId}
              onChange={(e) => setForm((p) => ({ ...p, modalidadeId: e.target.value }))}
              className={inputCls}
            >
              <option value="">Selecionar modalidade</option>
              {MODALIDADES.map((m) => <option key={m.id} value={m.id}>{m.icone} {m.nome}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
              success
                ? 'bg-green-600 text-white'
                : loading
                ? 'bg-accent/40 text-white cursor-wait'
                : 'bg-accent text-white hover:bg-accent-hover'
            }`}
          >
            {success ? '✅ Medalha atribuída!' : loading ? 'Salvando…' : 'Atribuir Medalha'}
          </button>
        </form>
      </div>
    </div>
  );
}
