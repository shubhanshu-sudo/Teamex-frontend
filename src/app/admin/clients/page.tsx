'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Clients</h2>
        <p className="text-muted-foreground">Manage client logos. (API and UI can be extended here.)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the same pattern as Activities: CRUD API exists in backend (Client model).
            Add list/create/edit pages and connect to <code className="rounded bg-muted px-1">/api/clients</code> when ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
