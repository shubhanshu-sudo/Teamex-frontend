'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Team</h2>
        <p className="text-muted-foreground">Manage team members. (API and UI can be extended here.)</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            TeamMember model exists in backend. Add routes and admin UI when ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
