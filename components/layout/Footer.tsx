import Link from 'next/link';

const LINKS = [
  { href: '/delegacoes',  label: 'Delegações' },
  { href: '/medalhas',    label: 'Quadro de Medalhas' },
  { href: '/ranking',     label: 'Ranking' },
  { href: '/modalidades', label: 'Modalidades' },
  { href: '/partidas',    label: 'Partidas' },
  { href: '/ao-vivo',     label: 'Ao Vivo' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-slate-100 mb-1">
              <span>🏅</span>
              <span>Olimpíadas TDJ</span>
            </div>
            <p className="text-sm text-gray-400 dark:text-slate-500">3ª Edição · Comunidade TDJ</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-400 dark:text-slate-500 text-center">
          Feito com ❤️ para a comunidade TDJ Haxball
        </div>
      </div>
    </footer>
  );
}
