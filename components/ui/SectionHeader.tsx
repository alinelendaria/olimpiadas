import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = 'Ver tudo',
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-8', align === 'center' && 'text-center', className)}>
      <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="flex-1">
          <div className={cn('flex items-center gap-4', viewAllHref ? 'justify-between' : align === 'center' ? 'justify-center' : 'justify-start')}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            {viewAllHref && (
              <Link href={viewAllHref} className="text-sm text-accent font-medium hover:underline shrink-0">
                {viewAllLabel} →
              </Link>
            )}
          </div>
          <div className={cn('mt-2 h-px bg-gray-100', align === 'center' ? 'mx-auto w-32' : 'w-full max-w-xs')} />
        </div>
      </div>

      {subtitle && (
        <p className={cn('mt-3 text-sm text-gray-500', align === 'center' && 'mx-auto max-w-2xl')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
