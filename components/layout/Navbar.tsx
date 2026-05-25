'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import BetProfileModal from '@/components/bet/BetProfileModal';
import CoinIcon from '@/components/bet/CoinIcon';

const NAV_LINKS = [
  { href: '/',               label: 'Home' },
  { href: '/delegacoes',     label: 'Delegações' },
  { href: '/chaveamentos',   label: 'Modalidades' },
  { href: '/medalhas',       label: 'Medalhas' },
  { href: '/ranking',        label: 'Ranking' },
  { href: '/ao-vivo',        label: 'Ao Vivo', isLive: true },
  { href: '/bet',            label: 'TDJ BET', isBet: true },
];

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.999 19.999 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.201 13.201 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [user, setUser]               = useState<User | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const avatar    = user?.user_metadata?.avatar_url;
  const username  = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Usuário';

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-sm border-b border-gray-100' : 'border-b border-gray-100'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-base tracking-tight">
          <span className="text-xl">🏅</span>
          <span>Olimpíadas <span className="text-accent">TDJ</span></span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/') && link.href !== '/';
            if (link.isBet) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-150 border',
                    active
                      ? 'bg-green-500 text-white border-green-500'
                      : 'text-green-600 border-green-300 bg-green-50 hover:bg-green-500 hover:text-white hover:border-green-500'
                  )}
                >
                  <CoinIcon size={15} />
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
                  active
                    ? 'bg-accent-light text-accent'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {link.isLive && <span className="live-dot" />}
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/admin"
            className="ml-2 px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
          >
            Admin
          </Link>

          {/* Login / Avatar */}
          <div className="ml-2 relative">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBetModal(v => !v)}
                  title="Perfil BET"
                  className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors"
                >
                  {avatar ? (
                    <img src={avatar} alt={username} className="w-7 h-7 rounded-full border border-gray-200" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center text-xs font-bold text-accent">
                      {username.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate hidden lg:block">{username}</span>
                </button>
                <button
                  onClick={handleLogout}
                  title="Sair"
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors"
              >
                <DiscordIcon />
                Entrar
              </button>
            )}
            {showBetModal && (
              <BetProfileModal onClose={() => setShowBetModal(false)} />
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-gray-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                if (link.isBet) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold border transition-colors',
                        active
                          ? 'bg-green-500 text-white border-green-500'
                          : 'text-green-600 border-green-300 bg-green-50 hover:bg-green-500 hover:text-white hover:border-green-500'
                      )}
                    >
                      <CoinIcon size={16} />
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      active ? 'bg-accent-light text-accent' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {link.isLive && <span className="live-dot" />}
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                className="px-3 py-2.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                Admin
              </Link>

              {/* Login mobile */}
              <div className="pt-2 border-t border-gray-100 mt-1">
                {user ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      {avatar && (
                        <img src={avatar} alt={username} className="w-7 h-7 rounded-full border border-gray-200" />
                      )}
                      <span className="text-sm text-gray-700 font-medium">{username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors"
                  >
                    <DiscordIcon />
                    Entrar com Discord
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
