'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, BarChart2, Trophy, Users, Lock, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_LINKS = [
  { href: '/admin',              label: 'Dashboard',    icon: BarChart2 },
  { href: '/admin/chaveamentos', label: 'Chaveamentos', icon: GitBranch },
  { href: '/admin/medalhas',     label: 'Medalhas',     icon: Trophy },
  { href: '/admin/jogadores',    label: 'Jogadores',    icon: Users },
];

const ADMIN_PASSWORD = 'tdj2024';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname();

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-5">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Área Administrativa</h1>
          <p className="text-sm text-gray-400 mb-6">Digite a senha para acessar o painel.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === ADMIN_PASSWORD) { setAuthenticated(true); setError(''); }
              else setError('Senha incorreta. Tente novamente.');
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de acesso"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-center tracking-widest"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
            >
              Entrar
            </button>
          </form>

          <Link href="/" className="mt-4 block text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white border-r border-gray-100 fixed left-0 top-14 bottom-0 overflow-y-auto z-40">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6 pt-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent tracking-widest uppercase">Admin</span>
          </div>

          <nav className="space-y-1">
            {ADMIN_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent-light text-accent'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setAuthenticated(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-52 flex-1 p-8">{children}</main>
    </div>
  );
}
