import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiDelete } from '../lib/api.js';
import { Trash2, Edit2, X } from 'lucide-react';
import { Button, Input, Label, Select, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell, Badge } from '../components/ui.jsx';

export default function UsersPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['users'], queryFn: () => apiGet('/users') });
  const items = data?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (user) => {
    setEditId(user._id);
    setEditForm(user);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/users/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['users'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await apiDelete(`/users/${id}`);
      await qc.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <tbody>{items.map((user) => <TableRow key={user._id}><TableCell className="font-medium">{user.fullName}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.roleName}</TableCell><TableCell><Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Disabled'}</Badge></TableCell><TableCell className="flex gap-2"><Button size="sm" variant="outline" onClick={() => startEdit(user)}><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => deleteUser(user._id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>)}</tbody>
            </table>
          </Table>
        </CardContent>
      </Card>

      {editId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit User</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <Input value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editForm.email || ''} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editForm.isActive ? '1' : '0'} onChange={(e) => setEditForm({...editForm, isActive: e.target.value === '1'})}>
                <option value="1">Active</option>
                <option value="0">Disabled</option>
              </Select>
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
