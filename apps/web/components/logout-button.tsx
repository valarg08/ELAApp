'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiSend } from '@/lib/api-client';
import { Button } from './ui';

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await apiSend('/auth/logout');
    } finally {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <Button variant="secondary" onClick={logout} disabled={busy}>
      Log out
    </Button>
  );
}
