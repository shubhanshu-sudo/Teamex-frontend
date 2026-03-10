'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
        <p className="text-muted-foreground">Manage testimonials. (API and UI can be extended here.)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Testimonial model exists in backend. Add routes and admin UI when ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
