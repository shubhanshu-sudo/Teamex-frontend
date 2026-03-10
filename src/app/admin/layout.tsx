'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Activity,
  FileText,
  FolderTree,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  Bell,
  Search,
  Quote,
  UserCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/activities', label: 'Activities', icon: Activity },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { admin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'flex flex-col border-r border-slate-800 bg-slate-900 transition-all duration-200',
          sidebarOpen ? 'w-56' : 'w-0 overflow-hidden md:w-16'
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen((o) => !o)}
            className="shrink-0 text-slate-300 hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {sidebarOpen && (
            <span className="truncate font-semibold text-slate-100">
              Teamex
              <span className="ml-1 rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-normal text-yellow-400">
                Admin
              </span>
            </span>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors',
                  isActive
                    ? 'bg-slate-800 text-yellow-400'
                    : 'hover:bg-slate-800 hover:text-slate-100'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full bg-transparent transition-colors group-hover:bg-slate-500',
                    isActive && 'bg-yellow-400'
                  )}
                />
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white/80 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground">
              <Search className="mr-2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search across activities, blogs, leads..."
                className="h-6 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-slate-500 hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-yellow-400" />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground md:flex">
              <UserCircle2 className="h-4 w-4 text-slate-500" />
              <span className="max-w-[140px] truncate">{admin?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-yellow-400 bg-yellow-400/90 text-slate-900 hover:bg-yellow-400"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 bg-gradient-to-b from-background to-slate-50 p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
