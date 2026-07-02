import React from 'react';
import { NavLink } from 'react-router-dom';
import { Boxes, ChartColumn, CreditCard, FolderInput, LayoutDashboard, Package2, ReceiptText, ShieldCheck, Settings2, ShoppingCart, StickyNote, Store, Users, Warehouse, BellRing } from 'lucide-react';
import { Badge } from '../ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { cn } from '../../lib/utils.js';

const sections = [
  { label: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Operations', items: [
    { to: '/sales', label: 'Sales', icon: ShoppingCart },
    { to: '/sales-history', label: 'Sales History', icon: ReceiptText },
    { to: '/inventory', label: 'Inventory', icon: Warehouse },
    { to: '/products', label: 'Products', icon: Boxes },
    { to: '/categories', label: 'Categories', icon: Package2 },
    { to: '/purchases', label: 'Purchases', icon: FolderInput },
    { to: '/expenses', label: 'Expenses', icon: CreditCard },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/suppliers', label: 'Suppliers', icon: Store }
  ]},
  { label: 'Insights', items: [
    { to: '/reports', label: 'Reports', icon: ChartColumn, roles: ['admin'] },
    { to: '/audit-log', label: 'Audit Log', icon: ShieldCheck, roles: ['admin'] },
    { to: '/users', label: 'Users', icon: Users, roles: ['admin'] },
    { to: '/settings', label: 'Settings', icon: Settings2, roles: ['admin'] },
    { to: '/receipt/demo', label: 'Receipt Preview', icon: BellRing }
  ]}
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/85 px-4 py-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 lg:block">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
          <Package2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700 dark:text-brand-200">Nasara</p>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Phone Accessories</h1>
        </div>
      </div>

      <nav className="space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{section.label}</p>
            <div className="mt-2 space-y-1">
              {section.items.map((item) => (
                (!item.roles || item.roles.includes(user?.roleName)) ? (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => cn(
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                ) : null
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
