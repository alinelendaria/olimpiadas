'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/',               label: 'Home' },
  { href: '/delegacoes',     label: 'Delegações' },
  { href: '/chaveamentos',   label: 'Modalidades' },
  { href: '/medalhas',       label: 'Medalhas' },
  { href: '/ranking',        label: 'Ranking' },
  { href: '/ao-vivo',        label: 'Ao Vivo', isLive: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

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
          <span>TDJ <span className="text-accent">Olympics</span></span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
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
            className="ml-3 px-3 py-1.5 rounded-md text-xs font-medium border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
          >
            Admin
          </Link>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
