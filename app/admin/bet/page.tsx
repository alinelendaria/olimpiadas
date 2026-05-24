'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BetEvent, BetOption } from '@/types/bet';

const STATUS_STYLE: Record<string, string> = {
  aberta:    'text-green-700 bg-green-50 border-green-200',
  encerrada: 'text-gray-500 bg-gray-50 border-gray-200',
  cancelada: 'text-red-500 bg-red-50 border-red-200',
};

interface OptionInput { texto: string; odd: string; }

export default function AdminBetPage() {
  const [events, setEvents]     = useState<BetEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [titulo,    setTitulo]    = useState('');
  const [descricao, setDescricao] = useState('');
  const [encerraDt, setEncerraDt] = useState('');
  const [opcoes, setOpcoes]       = useState<OptionInput[]>([
    { texto: '', odd: '' },
    { texto: '', odd: '' },
  ]);
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg]         = useState('');

  // Resolve state
  const [resolveLoading, setResolveLoading] = useState<string | null>(null);
  const [resolveMsg, setResolveMsg]         = useState<Record<string, string>>({});

  async function loadEvents() {
    const res = await fetch('/api/bet/events');
    if (res.ok) {
      const { events: ev } = await res.json();
      setEvents(ev ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { loadEvents(); }, []);

  function addOption() {
    setOpcoes(prev => [...prev, { texto: '', odd: '' }]);
  }

  function removeOption(i: number) {
    setOpcoes(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateOption(i: number, field: 'texto' | 'odd', value: string) {
    setOpcoes(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || opcoes.some(o => !o.texto.trim() || !o.odd)) {
      setFormMsg('Preencha título e todas as opções.');
      return;
    }
    setFormLoading(true);
    setFormMsg('');
    const res = await fetch('/api/bet/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        encerra_em: encerraDt || null,
        opcoes: opcoes.map(o => ({ texto: o.texto.trim(), odd: parseFloat(o.odd) })),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setFormMsg('✅ Evento criado!');
      setTitulo(''); setDescricao(''); setEncerraDt('');
      setOpcoes([{ texto: '', odd: '' }, { texto: '', odd: '' }]);
      setShowForm(false);
      loadEvents();
    } else {
      setFormMsg(data.error ?? 'Erro ao criar evento.');
    }
    setFormLoading(false);
  }

  async function handleResolve(event: BetEvent, opcaoId: string) {
    setResolveLoading(event.id);
    const res = await fetch('/api/bet/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, opcao_vencedora_id: opcaoId }),
    });
    const data = await res.json();
    setResolveMsg(prev => ({ ...prev, [event.id]: res.ok ? `✅ Resolvido — ${data.resolved ?? 0} apostas pagas.` : data.error }));
    setResolveLoading(null);
    loadEvents();
  }

  async function handleCancel(eventId: string) {
    if (!confirm('Cancelar este evento? Os apostadores serão reembolsados.')) return;
    setResolveLoading(eventId);
    const res = await fetch('/api/bet/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, cancelar: true }),
    });
    const data = await res.json();
    setResolveMsg(prev => ({ ...prev, [eventId]: res.ok ? `✅ Cancelado — ${data.refunded ?? 0} reembolsados.` : data.error }));
    setResolveLoading(null);
    loadEvents();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🪙 TDJ BET — Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Gerencie eventos de apostas fictícias</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo evento
        </button>
      </div>

      {/* Formulário criar evento */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card px-6 py-5 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Criar novo evento</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Título *</label>
              <input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Futebol Quintetos — Semifinal A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Descrição</label>
              <textarea
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                rows={2}
                placeholder="Descrição opcional..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Encerra em (opcional)</label>
              <input
                type="datetime-local"
                value={encerraDt}
                onChange={e => setEncerraDt(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500">Opções *</label>
                <button type="button" onClick={addOption} className="text-xs text-accent hover:underline">+ Adicionar opção</button>
              </div>
              <div className="space-y-2">
                {opcoes.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt.texto}
                      onChange={e => updateOption(i, 'texto', e.target.value)}
                      placeholder={`Opção ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-accent"
                    />
                    <input
                      value={opt.odd}
                      onChange={e => updateOption(i, 'odd', e.target.value)}
                      placeholder="Odd (ex: 1.80)"
                      type="number"
                      step="0.01"
                      min="1.01"
                      className="w-28 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-accent"
                    />
                    {opcoes.length > 2 && (
                      <button type="button" onClick={() => removeOption(i)} className="px-2 text-red-400 hover:text-red-600">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {formMsg && (
              <p className={cn('text-xs text-center', formMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500')}>
                {formMsg}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-40"
              >
                {formLoading ? 'Criando...' : 'Criar evento'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de eventos */}
      {loading ? (
        <p className="text-sm text-gray-400">Carregando...</p>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">🎲</p>
          <p className="text-sm">Nenhum evento ainda. Crie o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => {
            const options    = event.bet_options ?? [];
            const isExpanded = expandedId === event.id;
            return (
              <div key={event.id} className="bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden">
                {/* Event header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', STATUS_STYLE[event.status])}>
                        {event.status}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{event.titulo}</h3>
                    </div>
                    <p className="text-xs text-gray-400 ml-[52px]">
                      {options.length} opções
                      {event.encerra_em && ` · encerra ${new Date(event.encerra_em).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                    {event.descricao && (
                      <p className="text-xs text-gray-500">{event.descricao}</p>
                    )}

                    {/* Options + resolve */}
                    {event.status === 'aberta' ? (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Resolver — escolha a opção vencedora:</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {options.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => handleResolve(event, opt.id)}
                              disabled={resolveLoading === event.id}
                              className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-300 text-sm transition-colors disabled:opacity-40"
                            >
                              <span className="text-gray-700 font-medium">{opt.texto}</span>
                              <span className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                                ×{Number(opt.odd).toFixed(2)}
                                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                              </span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handleCancel(event.id)}
                          disabled={resolveLoading === event.id}
                          className="mt-2 flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelar evento (reembolsar apostadores)
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {options.map(opt => (
                          <div key={opt.id} className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-lg border text-sm',
                            opt.id === event.opcao_vencedora_id
                              ? 'bg-green-50 border-green-200 text-green-700 font-semibold'
                              : 'bg-gray-50 border-gray-100 text-gray-500'
                          )}>
                            <span>{opt.texto}</span>
                            <span className="flex items-center gap-1">
                              ×{Number(opt.odd).toFixed(2)}
                              {opt.id === event.opcao_vencedora_id && <span className="ml-1">✓</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {resolveMsg[event.id] && (
                      <p className={cn('text-xs text-center font-medium', resolveMsg[event.id].startsWith('✅') ? 'text-green-600' : 'text-red-500')}>
                        {resolveMsg[event.id]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
