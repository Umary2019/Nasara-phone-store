import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { formatDateTime, money } from '../lib/utils.js';

export default function SalesHistoryPage() {
  const { data } = useQuery({ queryKey: ['sales', 'history'], queryFn: () => apiGet('/sales') });
  const items = data?.items || [];
  return (
    <Card>
      <CardHeader><CardTitle>Sales History</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <table className="w-full">
            <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Cashier</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <tbody>
              {items.map((sale) => <TableRow key={sale._id}><TableCell className="font-medium">{sale.invoiceNumber}</TableCell><TableCell>{sale.cashierName}</TableCell><TableCell>{money(sale.totalAmount)}</TableCell><TableCell>{sale.status}</TableCell><TableCell>{formatDateTime(sale.createdAt)}</TableCell></TableRow>)}
            </tbody>
          </table>
        </Table>
      </CardContent>
    </Card>
  );
}
