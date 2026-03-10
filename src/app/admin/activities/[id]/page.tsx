'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const categoryId = watch('category');

  useEffect(() => {
    categoriesApi.list({ all: 'true' }).then(({ data }) => {
      setCategories((data.data as { _id: string; name: string }[]) || []);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    activitiesApi.getById(id).then(({ data }) => {
      const activity = data.data as { _id: string; title?: string; shortDescription?: string; description?: string; category?: { _id: string } | string; duration?: string; locationType?: string; intensity?: string; status?: string; metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
      if (activity) {
        setValue('title', activity.title || '');
        setValue('shortDescription', activity.shortDescription || '');
        setValue('description', activity.description || '');
        setValue('category', typeof activity.category === 'object' ? activity.category?._id ?? '' : (activity.category || ''));
        setValue('duration', activity.duration || '');
        setValue('locationType', activity.locationType || '');
        setValue('intensity', (activity.intensity as FormData['intensity']) || 'none');
        setValue('status', (activity.status as FormData['status']) || 'draft');
        setValue('metaTitle', activity.metaTitle || '');
        setValue('metaDescription', activity.metaDescription || '');
        setValue('canonicalUrl', activity.canonicalUrl || '');
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('teamex_token') : null;
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== '') formData.append(k, String(v));
      });
      if (file) formData.append('featuredImage', file);
      const res = await fetch(`${API_BASE}/api/activities/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        router.push('/admin/activities');
        return;
      }
      throw new Error(json.message || 'Update failed');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Activity</h2>
        <p className="text-muted-foreground">Update activity and SEO.</p>
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
                <Input id="duration" {...register('duration')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationType">Location type</Label>
                <Input id="locationType" {...register('locationType')} />
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
              <Label>Featured image (optional, upload new to replace)</Label>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta title</Label>
                <Input id="metaTitle" {...register('metaTitle')} maxLength={70} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" {...register('canonicalUrl')} />
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
            {submitting ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
