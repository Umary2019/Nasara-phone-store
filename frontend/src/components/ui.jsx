import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils.js';

export function Button({ className = '', variant = 'default', size = 'md', asChild = false, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline: 'border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-900',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700'
  };
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base'
  };

  const Comp = asChild ? 'span' : 'button';
  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function Badge({ className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
    muted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variants[variant], className)} {...props} />;
}

export function Card({ className = '', ...props }) {
  return <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={cn('border-b border-slate-100 px-5 py-4 dark:border-slate-800', className)} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={cn('text-base font-semibold text-slate-900 dark:text-slate-100', className)} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function Label({ className = '', ...props }) {
  return <label className={cn('mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300', className)} {...props} />;
}

export function Input({ className = '', ...props }) {
  return <input className={cn('h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-brand-950', className)} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={cn('min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-brand-950', className)} {...props} />;
}

export function Select({ className = '', ...props }) {
  return <select className={cn('h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-brand-950', className)} {...props} />;
}

export function Table({ className = '', ...props }) {
  return <div className={cn('overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800', className)} {...props} />;
}

export function TableHeader({ className = '', ...props }) {
  return <thead className={cn('bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400', className)} {...props} />;
}

export function TableRow({ className = '', ...props }) {
  return <tr className={cn('border-t border-slate-100 dark:border-slate-800', className)} {...props} />;
}

export function TableHead({ className = '', ...props }) {
  return <th className={cn('px-4 py-3 font-semibold', className)} {...props} />;
}

export function TableCell({ className = '', ...props }) {
  return <td className={cn('px-4 py-3 text-sm text-slate-700 dark:text-slate-300', className)} {...props} />;
}

export function Spinner({ className = '' }) {
  return <Loader2 className={cn('h-4 w-4 animate-spin', className)} />;
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, delta, tone = 'default' }) {
  const tones = {
    default: 'from-brand-500/15 to-brand-500/5 text-brand-700 dark:text-brand-200',
    accent: 'from-accent-500/15 to-accent-500/5 text-accent-700 dark:text-accent-200',
    rose: 'from-rose-500/15 to-rose-500/5 text-rose-700 dark:text-rose-200'
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</div>
          {delta ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{delta}</p> : null}
        </div>
        <div className={cn('rounded-2xl bg-gradient-to-br p-3', tones[tone])}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dialog({ open, title, description, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900">Close</button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">{footer}</div> : null}
      </div>
    </div>
  );
}
