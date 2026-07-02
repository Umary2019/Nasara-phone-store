import React from 'react';
import { ArrowRight, BarChart3, BatteryCharging, Headphones, Package, ShieldCheck, ShoppingBag, Smartphone, Truck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../components/ui.jsx';

const features = [
  { icon: ShoppingBag, title: 'Sales recording', text: 'Track every sale, receipt, payment method, and cashier in one place.' },
  { icon: Truck, title: 'Inventory control', text: 'Manage product quantities, low stock alerts, stock-in, and stock-out movement.' },
  { icon: Users, title: 'Customer records', text: 'Keep purchase history, balances, and customer notes organized.' },
  { icon: BarChart3, title: 'Business reports', text: 'Monitor profit, expenses, top products, and trends by date range.' },
  { icon: ShieldCheck, title: 'Secure access', text: 'Role-based access protects daily operations and sensitive data.' }
];

const featuredProducts = [
  { icon: Smartphone, name: 'Tecno Spark 30', price: 'NGN 165,000', note: '128GB storage, 8GB RAM, full-day battery life.' },
  { icon: Smartphone, name: 'Infinix Hot 40', price: 'NGN 178,000', note: 'Smooth display, fast charging, and dual SIM support.' },
  { icon: BatteryCharging, name: '20W Fast Charger', price: 'NGN 12,500', note: 'Reliable USB-C charging for most Android phones.' },
  { icon: Headphones, name: 'Bluetooth Earbuds', price: 'NGN 24,000', note: 'Clear calls, deep bass, and pocket-friendly case.' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-retail">
      <div className="mx-auto max-w-[90rem] px-2 py-4 sm:px-4 lg:px-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/50 bg-white/70 px-5 py-4 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.34em] text-brand-600 dark:text-brand-200 sm:text-2xl">Nasara Phone Accessories</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-3xl">Sales Record System</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="outline">Login</Button></Link>
            <Link to="/register"><Button>Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-12">
          <div className="space-y-7 lg:pr-6">
            <div className="inline-flex rounded-full border border-emerald-400 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm dark:border-emerald-400 dark:bg-emerald-500 dark:text-white">
              Retail operations for daily shop use
            </div>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              <span className="block text-brand-700 dark:text-brand-200">Nasara</span>
              A record system for a modern phone accessories shop.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Manage sales, inventory, customers, suppliers, expenses, users, and reports from a single secure dashboard.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/login"><Button size="lg">Open dashboard</Button></Link>
              <Link to="/register"><Button size="lg" variant="secondary">First-time setup</Button></Link>
            </div>
          </div>

          <Card className="overflow-hidden border-white/50 bg-white/82 shadow-2xl dark:border-slate-800 dark:bg-slate-950/80">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4 p-6 sm:p-8">
                {[
                  ['Today Sales', 'NGN 125,000'],
                  ['Low Stock', '8 items'],
                  ['Customers', '214'],
                  ['Profit', 'NGN 41,800']
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((item) => (
            <Card key={item.title} className="glass-panel">
              <CardContent className="p-6">
                <item.icon className="h-6 w-6 text-brand-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-brand-200">Featured products</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">Popular products currently highlighted in the shop</h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              These are example products with real names and prices so the page feels stocked and ready.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.name} className="border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                <CardContent className="p-5">
                  <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                    <product.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">{product.name}</h4>
                  <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-200">{product.price}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
