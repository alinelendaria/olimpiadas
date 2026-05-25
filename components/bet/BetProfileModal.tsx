'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import CoinIcon from '@/components/bet/CoinIcon';
import type { BetUser, BetBet } from '@/types/bet';

interface Props {
  onClose: () => void;
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={cn('text-lg font-bold', highlight ? 'text-amber-600' : 'text-gray-900')}>
        {value}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

export default function BetProfileModal({ onClose }: Props) {
  const [profile, setProfile]           = useState<BetUser | null>(null);
  const [bets, setBets]                 = useState<BetBet[]>([]);
  const [loading, setLoading]           = useState(true);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyMsg, setDailyMsg]         = useState('');
  const [countdown, setCountdown]       = useState('');

  const fetchProfile = useCallback(async () => {
    const res = await fetch('/api/bet/profile');
    if (!res.ok) { setLoading(false); return; }
    const { profile: p } = await res.json();
    setProfile(p);
    setLoading(false);
  }, []);

  const fetchBets = useCallback(async () => {
    try {
      const res = await fetch('/api/bet/my-bets');
      if (res.ok) {
        const { bets: b } = await res.json();
        setBets(b ?? []);
      }
    } catch { /* bets optional */ }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchBets();
  }, [fetchProfile, fetchBets]);

  useEffect(() => {
    if (!profile?.last_daily_reward) return;
    const next = new Date(profile.last_daily_reward).getTime() + 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = next - Date.now();
      if (diff <= 0) { setCountdown(''); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setCountdown(`${h}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [profile?.last_daily_reward]);

  async function handleDaily() {
    setDailyLoading(true);
    setDailyMsg('');
    const res = await fetch('/api/bet/daily', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setProfile(data.profile);
      setDailyMsg('+100 moedas resgatadas! 🎉');
    } else {
      setDailyMsg(data.error === 'cooldown' ? `Disponível em ${countdown}` : data.error);
    }
    setDailyLoading(false);
  }

  const canClaimDaily = !profile?.last_daily_reward ||
    Date.now() >= new Date(profile.last_daily_reward).getTime() + 24 * 60 * 60 * 1000;

  const winRate = profile
    ? (profile.apostas_ganhas + profile.apostas_perdidas) > 0
      ? ((profile.apostas_ganhas / (profile.apostas_ganhas + profile.apostas_perdidas)) * 100).toFixed(1)
      : '—'
    : '—';

  const roi = profile && profile.total_apostado > 0
    ? (((profile.total_ganho - profile.total_apostado) / profile.total_apostado) * 100).toFixed(1)
    : '—';

  const STATUS_STYLE: Record<string, string> = {
    aberta:    'text-blue-600 bg-blue-50',
    ganha:     'text-green-600 bg-green-50',
    perdida:   'text-red-500 bg-red-50',
    cancelada: 'text-gray-400 bg-gray-50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-accent-light to-white">
          <div className="flex items-center gap-2">
            <CoinIcon size={20} />
            <span className="font-bold text-gray-900 text-sm">TDJ BET</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">Carregando...</div>
        ) : !profile ? (
          <div className="py-8 px-5 text-center">
            <p className="text-sm text-gray-500 mb-3">Faça login para acessar o TDJ BET</p>
            <a href="/bet" className="text-accent text-sm font-medium hover:underline">Ir para TDJ BET →</a>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            {/* Saldo */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <CoinIcon size={28} />
                <p className="text-2xl font-extrabold text-amber-700">{profile.saldo.toLocaleString()}</p>
              </div>
              <p className="text-xs text-amber-600 mt-0.5">moedas fictícias</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-xl px-3 py-3">
              <Stat label="Apostado" value={profile.total_apostado.toLocaleString()} />
              <Stat label="Win Rate" value={`${winRate}%`} highlight />
              <Stat label="Ganhas"   value={profile.apostas_ganhas} />
              <Stat label="Perdidas" value={profile.apostas_perdidas} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 border border-green-100 rounded-xl px-2 py-2 text-center">
                <TrendingUp className="w-3.5 h-3.5 text-green-500 mx-auto mb-0.5" />
                <p className="text-xs font-bold text-green-700">{profile.total_ganho.toLocaleString()}</p>
                <p className="text-[10px] text-green-500">Total ganho</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl px-2 py-2 text-center">
                <TrendingDown className="w-3.5 h-3.5 text-red-400 mx-auto mb-0.5" />
                <p className="text-xs font-bold text-red-500">{profile.total_perdido.toLocaleString()}</p>
                <p className="text-[10px] text-red-400">Total perdido</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-2 py-2 text-center">
                <span className="block mb-0.5"><CoinIcon size={14} /></span>
                <p className="text-xs font-bold text-amber-700">{profile.maior_vitoria.toLocaleString()}</p>
                <p className="text-[10px] text-amber-500">Maior vitória</p>
              </div>
            </div>

            {roi !== '—' && (
              <p className="text-center text-xs text-gray-500">
                ROI fictício:{' '}
                <span className={cn('font-semibold', Number(roi) >= 0 ? 'text-green-600' : 'text-red-500')}>
                  {Number(roi) >= 0 ? '+' : ''}{roi}%
                </span>
              </p>
            )}

            {/* Recompensa diária */}
            <div>
              <button
                onClick={handleDaily}
                disabled={!canClaimDaily || dailyLoading}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  canClaimDaily
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {dailyLoading ? 'Processando...' :
                  canClaimDaily
                    ? <span className="flex items-center justify-center gap-1.5">🎁 Resgatar 100 <CoinIcon size={15} /></span>
                    : `⏳ Disponível em ${countdown}`}
              </button>
              {dailyMsg && (
                <p className={cn('text-xs text-center mt-1.5', dailyMsg.startsWith('+') ? 'text-green-600' : 'text-gray-500')}>
                  {dailyMsg}
                </p>
              )}
            </div>

            {/* Últimas apostas */}
            {bets.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Apostas recentes</p>
                <div className="space-y-1.5">
                  {bets.slice(0, 4).map(bet => (
                    <div key={bet.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', STATUS_STYLE[bet.status] ?? 'bg-gray-50 text-gray-400')}>
                          {bet.status}
                        </span>
                        <span className="text-gray-600 truncate">
                          {bet.bet_options?.texto ?? '—'}
                        </span>
                      </div>
                      <span className="text-gray-500 shrink-0 ml-2 flex items-center gap-0.5">
                        <CoinIcon size={11} /> {bet.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <a
              href="/bet"
              className="block text-center text-xs text-accent font-medium hover:underline pt-1"
            >
              Ver todas as apostas →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
