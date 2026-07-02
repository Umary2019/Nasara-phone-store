import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui.jsx';
import { money, formatDateTime } from '../lib/utils.js';

export default function ReceiptPreviewPage() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['sale', id], queryFn: () => apiGet(`/sales/${id}`), enabled: Boolean(id) && id !== 'demo' });
  const sale = data?.item || data?.sale || null;
  const preview = sale || {
    invoiceNumber: 'DEMO-INV-001',
    cashierName: 'Cashier',
    createdAt: new Date().toISOString(),
    items: [{ productName: 'Phone Case', quantity: 1, lineTotal: 5000 }],
    totalAmount: 5000
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Receipt Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold">Nasara Phone Accessories</div>
          <div className="text-sm text-slate-500">Receipt #{preview.invoiceNumber}</div>
          <div className="text-xs text-slate-500">{formatDateTime(preview.createdAt)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          {preview.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1 text-sm">
              <span>{item.productName} x {item.quantity}</span>
              <span>{money(item.lineTotal)}</span>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold dark:border-slate-800">
            <span>Total</span>
            <span>{money(preview.totalAmount)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.print()}>Print</Button>
          <Button variant="outline" onClick={() => window.alert('PDF export can be added via report endpoint or browser print to PDF')}>Download PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
}
