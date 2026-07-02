import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiDelete } from '../lib/api.js';
import { BatteryCharging, Headphones, Smartphone, Trash2, Edit2, X } from 'lucide-react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { formatDateTime, money } from '../lib/utils.js';

export default function PurchasesPage() {
  const qc = useQueryClient();
  const { data: productsData } = useQuery({ queryKey: ['purchases', 'products'], queryFn: () => apiGet('/products') });
  const { data } = useQuery({ queryKey: ['purchases'], queryFn: () => apiGet('/purchases') });
  const items = data?.items || [];
  const products = productsData?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (purchase) => {
    setEditId(purchase._id);
    setEditForm(purchase);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/purchases/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['purchases'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const deletePurchase = async (id) => {
    if (!confirm('Delete this purchase record?')) return;
    try {
      await apiDelete(`/purchases/${id}`);
      await qc.invalidateQueries({ queryKey: ['purchases'] });
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const productCards = products.slice(0, 4).map((product, index) => {
    const icons = [Smartphone, BatteryCharging, Headphones, Smartphone];
    const Icon = icons[index] || Smartphone;
    return { ...product, Icon };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products to Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productCards.length ? productCards.map((product) => (
              <div key={product._id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                  <product.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-600 dark:text-brand-200">{money(product.sellingPrice)}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Stock: {product.quantityInStock}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">SKU: {product.sku}</p>
              </div>
            )) : <div className="text-sm text-slate-500">No products found</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Purchases / Stock In</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Supplier</TableHead><TableHead>Total Cost</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <tbody>{items.map((purchase) => <TableRow key={purchase._id}><TableCell className="font-medium">{purchase.referenceNumber}</TableCell><TableCell>{purchase.supplier?.supplierName || '-'}</TableCell><TableCell>{money(purchase.totalCost)}</TableCell><TableCell>{formatDateTime(purchase.createdAt)}</TableCell><TableCell className="flex gap-2"><Button size="sm" variant="outline" onClick={() => startEdit(purchase)}><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => deletePurchase(purchase._id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>)}</tbody>
            </table>
          </Table>
        </CardContent>
      </Card>

      {editId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Purchase</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Reference number</Label>
              <Input value={editForm.referenceNumber || ''} onChange={(e) => setEditForm({...editForm, referenceNumber: e.target.value})} />
            </div>
            <div>
              <Label>Total cost</Label>
              <Input type="number" value={editForm.totalCost || 0} onChange={(e) => setEditForm({...editForm, totalCost: Number(e.target.value)})} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
