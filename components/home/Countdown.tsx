'use client';

import { useEffect, useState } from 'react';

const EVENT_DATE = new Date('2024-08-10T14:00:00');

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const units = [
    { value: time.days,    label: 'Dias' },
    { value: time.hours,   label: 'Horas' },
    { value: time.minutes, label: 'Minutos' },
    { value: time.seconds, label: 'Segundos' },
  ];

  return (
    <section className="bg-subtle border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Evento começa em</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">10 de Agosto de 2024 · 14h00</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {units.map((u, i) => (
            <div key={u.label} className="flex items-center gap-3 sm:gap-5">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">
                  {pad(u.value)}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{u.label}</div>
              </div>
              {i < units.length - 1 && (
                <span className="text-gray-300 text-xl font-light">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
