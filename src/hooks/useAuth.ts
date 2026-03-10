'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { authApi } from '@/services/api';

export type Admin = { id: string; name: string; email: string; role: string };

export function useAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('teamex_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getProfile();
      if (data.success && data.admin) {
        setAdmin(data.admin as Admin);
      }
    } catch (error) {
      // Network errors shouldn't immediately log the user out;
      // 401s are handled by the Axios interceptor in api.ts.
      console.error('Failed to load admin profile', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Hydrate admin from localStorage first so dashboard doesn't flicker
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teamex_admin');
      if (stored) {
        try {
          setAdmin(JSON.parse(stored) as Admin);
        } catch {
          // ignore bad JSON
        }
      }
    }
    loadProfile();
  }, [loadProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await authApi.login(email, password);
      if (data.success && data.token && data.admin) {
        localStorage.setItem('teamex_token', data.token);
        localStorage.setItem('teamex_admin', JSON.stringify(data.admin));
        setAdmin(data.admin as Admin);
        router.push('/admin/dashboard');
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('teamex_token');
    localStorage.removeItem('teamex_admin');
    setAdmin(null);
    router.push('/admin/login');
  }, [router]);

  return { admin, loading, login, logout, loadProfile };
}
