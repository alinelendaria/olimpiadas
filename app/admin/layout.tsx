'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, BarChart2, Trophy, Users, Lock, GitBranch, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const ADMIN_LINKS = [
  { href: '/admin',              label: 'Dashboard',    icon: BarChart2 },
  { href: '/admin/chaveamentos', label: 'Chaveamentos', icon: GitBranch },
  { href: '/admin/medalhas',     label: 'Medalhas',     icon: Trophy },
  { href: '/admin/jogadores',    label: 'Jogadores',    icon: Users },
];

const ADMIN_DISCORD_ID = '409098047344345088';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const discordId = user.identities?.find(i => i.provider === 'discord')?.id;
      if (discordId === ADMIN_DISCORD_ID) {
        setIsAdmin(true);
      } else {
        setErrorMsg('Sua conta Discord não tem permissão de admin.');
      }
    }

    setLoading(false);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setErrorMsg('');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Verificando acesso...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-card p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-5">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Área Administrativa</h1>
          <p className="text-sm text-gray-400 mb-6">Faça login com Discord para acessar.</p>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-4">{errorMsg}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full py-2.5 rounded-lg bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752C4] transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.999 19.999 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Entrar com Discord
          </button>

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
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3 h-3" />
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
