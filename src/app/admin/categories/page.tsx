'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoriesApi } from '@/services/api';
import { Pencil, Trash2, Plus } from 'lucide-react';

type Category = { _id: string; name: string; slug: string; status: string; description?: string };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showNew, setShowNew] = useState(false);

  const load = async () => {
    try {
      const { data } = await categoriesApi.list({ all: 'true' });
      setItems((data.data as Category[]) || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await categoriesApi.create({ name: newName.trim() });
      setNewName('');
      setShowNew(false);
      await load();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Create failed');
    }
  };

  const handleUpdate = async (id: string, name: string) => {
    try {
      await categoriesApi.update(id, { name });
      setEditingId(null);
      await load();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await categoriesApi.delete(id);
      await load();
    } catch (err: unknown) {
      alert((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage categories for activities and blogs.</p>
        </div>
        {!showNew && (
          <Button onClick={() => setShowNew(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNew && (
            <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-2 border-b border-border pb-4">
              <div className="min-w-[200px] space-y-2">
                <Label htmlFor="newName">Name</Label>
                <Input
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Category name"
                />
              </div>
              <Button type="submit">Create</Button>
              <Button type="button" variant="outline" onClick={() => { setShowNew(false); setNewName(''); }}>
                Cancel
              </Button>
            </form>
          )}
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No categories yet.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((c) => (
                <li
                  key={c._id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3"
                >
                  {editingId === c._id ? (
                    <form
                      className="flex flex-1 flex-wrap items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.target as HTMLFormElement).querySelector('input');
                        if (input?.value) handleUpdate(c._id, input.value);
                      }}
                    >
                      <Input defaultValue={c.name} name="editName" className="max-w-xs" />
                      <Button type="submit" size="sm">Save</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div>
                        <span className="font-medium">{c.name}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{c.slug}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditingId(c._id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c._id, c.name)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
