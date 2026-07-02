import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPut, apiDelete } from '../lib/api.js';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { Trash2, Edit2, X } from 'lucide-react';

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['categories'], queryFn: () => apiGet('/categories') });
  const items = data?.items || [];
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (category) => {
    setEditId(category._id);
    setEditForm(category);
  };

  const saveEdit = async () => {
    try {
      await apiPut(`/categories/${editId}`, editForm);
      await qc.invalidateQueries({ queryKey: ['categories'] });
      setEditId(null);
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await apiDelete(`/categories/${id}`);
      await qc.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Categories List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCategory(item._id)}><Trash2 className="h-4 w-4" /></Button>
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
              <CardTitle>Edit Category</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Name</Label>
              <Input value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editForm.description || ''} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
