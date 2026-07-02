import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '../lib/api.js';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Select } from '../components/ui.jsx';
import { money } from '../lib/utils.js';

export default function SalesPage() {
  const qc = useQueryClient();
  const { data: productsData } = useQuery({
    queryKey: ['products', 'list'],
    queryFn: () => apiGet('/products')
  });
  const { data: customersData } = useQuery({
    queryKey: ['customers', 'list'],
    queryFn: () => apiGet('/customers')
  });
  const products = productsData?.items || [];
  const customers = customersData?.items || [];

  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState('');

  const addToCart = (productId) => {
    const p = products.find((x) => x._id === productId);
    if (!p) return;
    setCart((c) => {
      const found = c.find((i) => i.product === productId);
      if (found) return c.map((i) => (i.product === productId ? { ...i, quantity: i.quantity + 1 } : i));
      return [...c, { product: productId, quantity: 1, sellingPrice: p.sellingPrice }];
    });
  };

  const updateQty = (productId, qty) => {
    setCart((c) => c.map((i) => (i.product === productId ? { ...i, quantity: Number(qty) } : i)));
  };

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.quantity * Number(it.sellingPrice || 0), 0), [cart]);

  const mutation = useMutation({
    mutationFn: (payload) => apiPost('/sales', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales', 'history'] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
      qc.invalidateQueries({ queryKey: ['products', 'list'] });
      qc.invalidateQueries({ queryKey: ['inventory', 'products'] });
      setCart([]);
      setCustomerId('');
    }
  });

  const checkout = async () => {
    if (!cart.length) return alert('Cart empty');
    try {
      await mutation.mutateAsync({ items: cart, paymentMethod: 'cash', amountPaid: subtotal, customer: customerId || null });
      alert('Sale created');
    } catch (err) {
      alert(err?.response?.data?.message || 'Sale failed');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Point of Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-3">
              <Select onChange={(e) => addToCart(e.target.value)}>
                <option value="">Add product...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} — {p.sku}</option>
                ))}
              </Select>

              <Input placeholder="Search (not implemented)" />
            </div>

            <div className="space-y-3">
              {cart.map((it) => {
                const p = products.find((x) => x._id === it.product) || {};
                return (
                  <div key={it.product} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.sku}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input value={it.quantity} onChange={(e) => updateQty(it.product, e.target.value)} style={{ width: 72 }} />
                      <div className="w-28 text-right">{money(it.quantity * it.sellingPrice)}</div>
                    </div>
                  </div>
                );
              })}

              {!cart.length ? <div className="text-sm text-slate-500">No items in cart</div> : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600">Customer</label>
                <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  <option value="">Walk-in customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.fullName} {customer.phoneNumber ? `(${customer.phoneNumber})` : ''}
                    </option>
                  ))}
                </Select>
                {!customers.length ? (
                  <div className="mt-2 text-xs text-slate-500">
                    No customers yet. <Link className="font-medium text-brand-600 hover:underline" to="/customers">Add one first</Link>.
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Subtotal</div>
                <div className="text-lg font-semibold">{money(subtotal)}</div>
              </div>

              <div className="flex gap-2">
                <Button onClick={checkout} className="flex-1">Pay</Button>
                <Button variant="outline" onClick={() => setCart([])}>Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
