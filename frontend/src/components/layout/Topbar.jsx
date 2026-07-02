import React from 'react';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Button, Input } from '../ui.jsx';
import { Link } from 'react-router-dom';

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden flex-1 lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search products, sales, customers..." />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-slate-500">Welcome back</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.fullName || 'Staff Member'}</p>
          </div>
          <Button variant="secondary" className="hidden sm:inline-flex" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
          <Link to="/sales" className="inline-flex h-10 items-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700">
            New Sale
          </Link>
        </div>
      </div>
    </header>
  );
}
