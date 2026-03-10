'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogsApi } from '@/services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Blog = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  author?: string;
  category?: { name: string };
  publishDate?: string;
};

export default function BlogsPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await blogsApi.list({ all: 'true', limit: 50 });
      setItems((data.data as Blog[]) || []);
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
      await blogsApi.delete(id);
      await load();
    } catch (e) {
      alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blogs</h2>
          <p className="text-muted-foreground">Manage blog posts and SEO.</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All blogs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No blogs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium">Title</th>
                    <th className="pb-2 text-left font-medium">Author</th>
                    <th className="pb-2 text-left font-medium">Status</th>
                    <th className="pb-2 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b._id} className="border-b border-border">
                      <td className="py-3">{b.title}</td>
                      <td className="py-3 text-muted-foreground">{b.author ?? '—'}</td>
                      <td className="py-3">
                        <span
                          className={
                            b.status === 'published'
                              ? 'text-green-600'
                              : b.status === 'draft'
                                ? 'text-amber-600'
                                : 'text-muted-foreground'
                          }
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link href={`/admin/blogs/${b._id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(b._id, b.title)}
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
