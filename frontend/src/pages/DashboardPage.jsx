import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Button, StatCard, Card, CardHeader, CardTitle, CardContent } from '../components/ui.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { money } from '../lib/utils.js';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiGet('/dashboard/summary')
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError) return <div>Failed to load dashboard</div>;

  const { totals, recentSales, salesChart, lowStockProducts } = data;

  const chartData = (salesChart || []).map((s) => ({ date: s._id, total: s.total }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today Sales" value={money(totals.salesToday)} />
        <StatCard title="Low Stock" value={totals.lowStockItems} />
        <StatCard title="Customers" value={totals.totalCustomers} />
        <StatCard title="Profit" value={money(totals.totalProfit)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/products"><Button>Add products</Button></Link>
            <Link to="/inventory"><Button variant="secondary">Check inventory</Button></Link>
            <Link to="/purchases"><Button variant="outline">Stock in / purchases</Button></Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1f9d80" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1f9d80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#1f9d80" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales?.length ? (
                recentSales.map((s) => (
                  <div key={s._id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.invoiceNumber}</div>
                      <div className="text-xs text-slate-500">{s.cashierName}</div>
                    </div>
                    <div className="text-sm font-semibold">{money(s.totalAmount)}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No recent sales</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Low stock items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lowStockProducts?.length ? (
                lowStockProducts.map((p) => (
                  <div key={p._id} className="rounded-lg border border-slate-100 p-3">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">SKU: {p.sku}</div>
                    <div className="mt-2 text-sm">In stock: {p.quantityInStock}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500">No low stock products</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
