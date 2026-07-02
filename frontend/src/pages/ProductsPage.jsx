import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '../lib/api.js';
import { Button, Input, Label, Select, Textarea, Table, TableHeader, TableRow, TableHead, TableCell, Card, CardHeader, CardTitle, CardContent } from '../components/ui.jsx';
import { money, formatDate } from '../lib/utils.js';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'list'],
    queryFn: () => apiGet('/products')
  });

  const { data: categoryData } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => apiGet('/categories')
  });

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    quantityInStock: 0,
    buyingPrice: '',
    sellingPrice: '',
    reorderLevel: 10,
    description: ''
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const categories = categoryData?.items || [];

  if (isLoading) return <div>Loading products...</div>;

  const items = data.items || data || [];

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateCategoryField = (field) => (event) => {
    setCategoryForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!categoryForm.name.trim()) return;

    setSavingCategory(true);
    try {
      const response = await apiPost('/categories', {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim()
      });

      const createdCategory = response?.item;
      setCategoryForm({ name: '', description: '' });
      await queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });

      if (createdCategory?._id) {
        setForm((current) => ({ ...current, category: createdCategory._id }));
      }
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiPost('/products', {
        ...form,
        category: form.category,
        quantityInStock: Number(form.quantityInStock),
        buyingPrice: Number(form.buyingPrice),
        sellingPrice: Number(form.sellingPrice),
        reorderLevel: Number(form.reorderLevel)
      });
      setForm({ name: '', sku: '', category: '', brand: '', quantityInStock: 0, buyingPrice: '', sellingPrice: '', reorderLevel: 10, description: '' });
      await queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleCreateCategory}>
            <div>
              <Label>Category name</Label>
              <Input value={categoryForm.name} onChange={updateCategoryField('name')} placeholder="Phones, Chargers, Accessories" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={categoryForm.description} onChange={updateCategoryField('description')} placeholder="Short category note" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={savingCategory}>{savingCategory ? 'Saving...' : 'Create category'}</Button>
            </div>
          </form>
          {categories.length === 0 ? (
            <p className="mt-3 text-sm text-amber-600 dark:text-amber-300">
              No categories exist yet. Create one above, then add your product.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleCreate}>
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={updateField('name')} placeholder="Product name" />
            </div>
            <div>
              <Label>SKU</Label>
              <Input value={form.sku} onChange={updateField('sku')} placeholder="SKU-001" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onChange={updateField('category')}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
              </Select>
              {!categories.length ? (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">You need at least one category before saving a product.</p>
              ) : null}
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={form.brand} onChange={updateField('brand')} placeholder="Brand name" />
            </div>
            <div>
              <Label>Buying price</Label>
              <Input type="number" value={form.buyingPrice} onChange={updateField('buyingPrice')} placeholder="0" />
            </div>
            <div>
              <Label>Selling price</Label>
              <Input type="number" value={form.sellingPrice} onChange={updateField('sellingPrice')} placeholder="0" />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={form.quantityInStock} onChange={updateField('quantityInStock')} placeholder="0" />
            </div>
            <div>
              <Label>Reorder level</Label>
              <Input type="number" value={form.reorderLevel} onChange={updateField('reorderLevel')} placeholder="10" />
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={updateField('description')} placeholder="Short product description" />
            </div>
            <div className="md:col-span-2 xl:col-span-3 flex justify-end">
              <Button type="submit" disabled={saving || !categories.length}>{saving ? 'Saving...' : 'Add product'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Buying</TableHead>
                  <TableHead>Selling</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {items.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.category?.name || '-'}</TableCell>
                    <TableCell>{p.quantityInStock}</TableCell>
                    <TableCell>{money(p.buyingPrice)}</TableCell>
                    <TableCell>{money(p.sellingPrice)}</TableCell>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
