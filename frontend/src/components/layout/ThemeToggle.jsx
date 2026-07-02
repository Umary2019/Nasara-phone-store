import React from 'react';
import { Monitor, MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light', icon: SunMedium },
    { value: 'dark', icon: MoonStar },
    { value: 'system', icon: Monitor }
  ];

  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {options.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${theme === value ? 'bg-brand-600 text-white' : 'hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
