import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { formatDate, money } from '../lib/utils.js';

export default function ExpensesPage() {
  const { data } = useQuery({ queryKey: ['expenses'], queryFn: () => apiGet('/expenses') });
  const items = data?.items || [];
  return (
    <Card>
      <CardHeader><CardTitle>Expenses</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <table className="w-full">
            <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
            <tbody>{items.map((expense) => <TableRow key={expense._id}><TableCell className="font-medium">{expense.category}</TableCell><TableCell>{money(expense.amount)}</TableCell><TableCell>{formatDate(expense.expenseDate)}</TableCell><TableCell>{expense.notes || '-'}</TableCell></TableRow>)}</tbody>
          </table>
        </Table>
      </CardContent>
    </Card>
  );
}
