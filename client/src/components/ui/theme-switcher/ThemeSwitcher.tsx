'use client';

import { useTheme } from '@/lib/themes/ThemeProvider';
import { themes } from '@/lib/themes/themes';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div
            className="h-6 w-6 rounded-full border-2 border-primary shadow-lg"
            style={{ backgroundColor: 'var(--primary)' }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 glass-backdrop border border-white/10">
        <h3 className="text-sm font-semibold mb-3 text-white">Temas Quânticos</h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`rounded-xl p-4 text-xs font-medium transition-all hover:scale-105 ${
                theme === t.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''
              }`}
              style={{ backgroundColor: t.bg, color: t.primary }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}