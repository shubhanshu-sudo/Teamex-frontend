'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, MessageSquare, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { activitiesApi, blogsApi, leadsApi } from '@/services/api';
import Link from 'next/link';

type Lead = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activities: 0,
    blogs: 0,
    leads: 0,
    clients: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [act, blg, ld] = await Promise.all([
          activitiesApi.list({ all: 'true', limit: 1 }),
          blogsApi.list({ all: 'true', limit: 1 }),
          leadsApi.list({ limit: 5 }),
        ]);
        setStats({
          activities: act.data.pagination?.total ?? 0,
          blogs: blg.data.pagination?.total ?? 0,
          leads: ld.data.pagination?.total ?? 0,
          clients: 0,
        });
        setRecentLeads((ld.data.data as Lead[]) || []);
      } catch {
        setStats({ activities: 0, blogs: 0, leads: 0, clients: 0 });
        setRecentLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = [
    {
      title: 'Activities',
      value: stats.activities,
      icon: Activity,
      href: '/admin/activities',
      subtitle: 'Live team-building experiences',
    },
    {
      title: 'Blogs',
      value: stats.blogs,
      icon: FileText,
      href: '/admin/blogs',
      subtitle: 'Thought leadership content',
    },
    {
      title: 'Leads',
      value: stats.leads,
      icon: MessageSquare,
      href: '/admin/leads',
      subtitle: 'New opportunities this week',
    },
    {
      title: 'Clients',
      value: stats.clients,
      icon: Users,
      href: '/admin/clients',
      subtitle: 'Active corporate accounts',
    },
  ];

  const quickActions = [
    {
      title: 'Add Activity',
      description: 'Launch a new Teamex experience.',
      href: '/admin/activities/new',
    },
    {
      title: 'Publish Blog',
      description: 'Share insights with your clients.',
      href: '/admin/blogs/new',
    },
    {
      title: 'Review Leads',
      description: 'Prioritise high-intent enquiries.',
      href: '/admin/leads',
    },
    {
      title: 'Add Client',
      description: 'Onboard a new corporate account.',
      href: '/admin/clients',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back to Teamex</h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Monitor live activities, content, and inbound leads for the Teamex corporate website — all in one premium
          control panel.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading analytics...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.title} href={c.href}>
              <Card className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-yellow-400/70 hover:shadow-lg">
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {c.title}
                    </CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-slate-900">{c.value}</span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-500">
                    <c.icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent className="pb-4 pt-0">
                  <p className="flex items-center text-xs text-muted-foreground">
                    {c.subtitle}
                    <ArrowRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((qa) => (
          <Link key={qa.title} href={qa.href}>
            <Card className="group flex h-full flex-col justify-between rounded-xl border border-dashed border-yellow-400/40 bg-white/90 shadow-sm transition-all hover:-translate-y-0.5 hover:border-yellow-400 hover:bg-yellow-50/80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold text-slate-900">{qa.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-500">{qa.description}</CardDescription>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-slate-900">
                  <PlusCircle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-1">
                <p className="flex items-center text-xs font-medium text-yellow-700">
                  Open
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent leads</h3>
            <p className="text-xs text-muted-foreground">The latest enquiries from the Teamex contact form.</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
          >
            View all
          </Link>
        </div>
        <Card className="overflow-hidden rounded-xl border border-border/80 bg-white/90">
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No leads yet. New enquiries will appear here.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Company</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80 bg-white">
                    {recentLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-medium text-slate-900">
                          {lead.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                          <a href={`mailto:${lead.email}`} className="hover:underline">
                            {lead.email}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                          {lead.company || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs">
                          <span
                            className={`
                              inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium
                              ${
                                lead.status === 'new'
                                  ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                                  : lead.status === 'qualified'
                                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                  : lead.status === 'contacted'
                                  ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
                                  : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
                              }
                            `}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
