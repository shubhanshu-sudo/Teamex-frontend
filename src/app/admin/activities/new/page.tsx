'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { activitiesApi, categoriesApi } from '@/services/api';
import { API_BASE } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  duration: z.string().optional(),
  locationType: z.string().optional(),
  intensity: z.enum(['low', 'medium', 'high', 'none']).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewActivityPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', intensity: 'none' },
  });

  const categoryId = watch('category');

  useEffect(() => {
    categoriesApi.list({ all: 'true' }).then(({ data }) => {
      setCategories((data.data as { _id: string; name: string }[]) || []);
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('teamex_token') : null;
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== 'none') formData.append(k, String(v));
      });
      if (file) formData.append('featuredImage', file);
      const res = await fetch(`${API_BASE}/api/activities`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success && json.data?._id) {
        router.push('/admin/activities');
        return;
      }
      throw new Error(json.message || 'Create failed');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">New Activity</h2>
        <p className="text-muted-foreground">Add an activity with SEO metadata.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register('title')} />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId || ''} onValueChange={(v) => setValue('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short description</Label>
              <Textarea id="shortDescription" {...register('shortDescription')} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={4} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" {...register('duration')} placeholder="e.g. 2 hours" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationType">Location type</Label>
                <Input id="locationType" {...register('locationType')} placeholder="Indoor / Outdoor" />
              </div>
              <div className="space-y-2">
                <Label>Intensity</Label>
                <Select value={watch('intensity') || 'none'} onValueChange={(v) => setValue('intensity', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Featured image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={watch('status') || 'draft'} onValueChange={(v) => setValue('status', v as FormData['status'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <p className="text-sm text-muted-foreground">metaTitle, metaDescription, slug (auto), canonicalUrl, ogImage</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta title</Label>
                <Input id="metaTitle" {...register('metaTitle')} maxLength={70} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" {...register('canonicalUrl')} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea id="metaDescription" {...register('metaDescription')} rows={2} maxLength={160} />
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create activity'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
