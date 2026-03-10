'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { activitiesApi } from '@/services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Activity = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category?: { name: string };
  createdAt?: string;
};

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await activitiesApi.list({ all: 'true', limit: 50 });
      setItems((data.data as Activity[]) || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await activitiesApi.delete(id);
      await load();
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Activities</h2>
          <p className="text-muted-foreground">Manage activities and SEO.</p>
        </div>
        <Link href="/admin/activities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All activities</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No activities yet. Create one to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium">Title</th>
                    <th className="pb-2 text-left font-medium">Slug</th>
                    <th className="pb-2 text-left font-medium">Category</th>
                    <th className="pb-2 text-left font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a._id} className="border-b border-border">
                      <td className="py-3">{a.title}</td>
                      <td className="py-3 text-muted-foreground">{a.slug}</td>
                      <td className="py-3">{a.category?.name ?? '—'}</td>
                      <td className="py-3">
                        <span
                          className={
                            a.status === 'published'
                              ? 'text-green-600'
                              : a.status === 'draft'
                                ? 'text-amber-600'
                                : 'text-muted-foreground'
                          }
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/activities/${a._id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(a._id, a.title)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
