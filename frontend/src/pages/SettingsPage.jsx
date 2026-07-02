import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut } from '../lib/api.js';
import { X } from 'lucide-react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';

export default function SettingsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['settings'], queryFn: () => apiGet('/settings') });
  const items = data?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (setting) => {
    setEditId(setting._id);
    setEditForm(setting);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/settings/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['settings'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Business Settings</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader><TableRow><TableHead>Business</TableHead><TableHead>Currency</TableHead><TableHead>Tax</TableHead><TableHead>Low Stock Threshold</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <tbody>{items.map((setting) => <TableRow key={setting._id}><TableCell className="font-medium">{setting.businessName}</TableCell><TableCell>{setting.currency}</TableCell><TableCell>{setting.taxRate}</TableCell><TableCell>{setting.lowStockThreshold}</TableCell><TableCell><Button size="sm" variant="outline" onClick={() => startEdit(setting)}>Edit</Button></TableCell></TableRow>)}</tbody>
            </table>
          </Table>
        </CardContent>
      </Card>

      {editId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Settings</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Business name</Label>
              <Input value={editForm.businessName || ''} onChange={(e) => setEditForm({...editForm, businessName: e.target.value})} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input value={editForm.currency || ''} onChange={(e) => setEditForm({...editForm, currency: e.target.value})} />
            </div>
            <div>
              <Label>Tax rate (%)</Label>
              <Input type="number" value={editForm.taxRate || 0} onChange={(e) => setEditForm({...editForm, taxRate: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Low stock threshold</Label>
              <Input type="number" value={editForm.lowStockThreshold || 10} onChange={(e) => setEditForm({...editForm, lowStockThreshold: Number(e.target.value)})} />
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
