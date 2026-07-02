import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiDelete } from '../lib/api.js';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { Trash2, Edit2, X } from 'lucide-react';

export default function CustomersPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['customers'], queryFn: () => apiGet('/customers') });
  const items = data?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (customer) => {
    setEditId(customer._id);
    setEditForm(customer);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/customers/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['customers'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const deleteCustomer = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try {
      await apiDelete(`/customers/${id}`);
      await qc.invalidateQueries({ queryKey: ['customers'] });
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Customers List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {items.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.fullName}</TableCell>
                    <TableCell>{c.phoneNumber}</TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell>{c.outstandingBalance || 0}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCustomer(c._id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </Table>
        </CardContent>
      </Card>

      {editId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Customer</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={editForm.phoneNumber || ''} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
            </div>
            <div>
              <Label>Outstanding balance</Label>
              <Input type="number" value={editForm.outstandingBalance || 0} onChange={(e) => setEditForm({...editForm, outstandingBalance: Number(e.target.value)})} />
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
