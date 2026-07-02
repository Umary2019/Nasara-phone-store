import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiDelete } from '../lib/api.js';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { Trash2, Edit2, X } from 'lucide-react';

export default function SuppliersPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['suppliers'], queryFn: () => apiGet('/suppliers') });
  const items = data?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (supplier) => {
    setEditId(supplier._id);
    setEditForm(supplier);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/suppliers/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['suppliers'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const deleteSupplier = async (id) => {
    if (!confirm('Delete this supplier?')) return;
    try {
      await apiDelete(`/suppliers/${id}`);
      await qc.invalidateQueries({ queryKey: ['suppliers'] });
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Suppliers List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {items.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="font-medium">{s.supplierName}</TableCell>
                    <TableCell>{s.phoneNumber}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.address}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(s)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSupplier(s._id)}><Trash2 className="h-4 w-4" /></Button>
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
              <CardTitle>Edit Supplier</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Supplier name</Label>
              <Input value={editForm.supplierName || ''} onChange={(e) => setEditForm({...editForm, supplierName: e.target.value})} />
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
              <Label>Address</Label>
              <Input value={editForm.address || ''} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
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
