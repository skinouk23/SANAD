import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/shared/lib/theme/theme-context';
import { cn } from '@/shared/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'default' | 'surface';
  className?: string;
}

export function ThemeSwitcher({ variant = 'default', className }: ThemeSwitcherProps) {
  const { toggleTheme, isDark } = useTheme();

  const isSurfaceVariant = variant === 'surface';
  const label = isDark ? 'Passer en mode clair' : 'Passer en mode sombre';

  return (
    <button
      aria-label={label}
      className={cn(
        'group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isSurfaceVariant
          ? 'border-border/70 bg-card/70 text-foreground hover:bg-accent hover:text-accent-foreground'
          : '',
        className,
      )}
      title={label}
      type="button"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Moon aria-hidden="true" className="h-5 w-5 text-foreground" />
      ) : (
        <Sun aria-hidden="true" className="h-5 w-5 text-foreground" />
      )}

      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-lg transition-colors',
          isSurfaceVariant ? 'bg-primary/0 group-hover:bg-primary/5' : 'bg-transparent',
        )}
      />
    </button>
  );
}
