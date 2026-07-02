import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { money } from '../lib/utils.js';

export default function InventoryPage() {
  const { data } = useQuery({ queryKey: ['inventory', 'products'], queryFn: () => apiGet('/products') });
  const items = data?.items || [];

  return (
    <Card>
      <CardHeader><CardTitle>Inventory Overview</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead><TableHead>SKU</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead>Profit / Unit</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {items.map((item) => {
                const status = item.quantityInStock <= 0 ? 'Out of stock' : item.quantityInStock <= (item.reorderLevel || 10) ? 'Low stock' : 'In stock';
                const variant = item.quantityInStock <= 0 ? 'danger' : item.quantityInStock <= (item.reorderLevel || 10) ? 'warning' : 'success';
                return (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.quantityInStock}</TableCell>
                    <TableCell><Badge variant={variant}>{status}</Badge></TableCell>
                    <TableCell>{money(item.sellingPrice - item.buyingPrice)}</TableCell>
                  </TableRow>
                );
              })}
            </tbody>
          </table>
        </Table>
      </CardContent>
    </Card>
  );
}
