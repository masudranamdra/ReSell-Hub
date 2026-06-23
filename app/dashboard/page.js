'use client';

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../components/Providers';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, token, authLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      router.replace('/login');
    } else {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, token, authLoading, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-primary-500 mb-2" size={32} />
      <p className="text-xs text-gray-500">Redirecting to your workspace...</p>
    </div>
  );
}
