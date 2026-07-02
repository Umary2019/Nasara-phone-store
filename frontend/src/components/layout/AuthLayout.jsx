import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Card } from '../ui.jsx';

export function AuthLayout({ badge = 'Retail operations suite', title, description, children, footer }) {
  return (
    <div className="min-h-screen bg-retail px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <aside className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 px-8 py-10 text-white shadow-2xl dark:border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_30%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to store
              </Link>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
                <Sparkles className="h-3.5 w-3.5" />
                {badge}
              </div>
              <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">{title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
            </div>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-xl">
          <Card className="overflow-hidden border-slate-200/80 bg-white/95 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur dark:bg-slate-950/95">
            <div className="border-b border-slate-100 px-6 py-6 dark:border-slate-800 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">{badge}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            <div className="px-6 py-6 sm:px-8">{children}</div>
            {footer ? <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500 dark:border-slate-800 sm:px-8">{footer}</div> : null}
          </Card>
        </main>
      </div>
    </div>
  );
}