'use client';

import { Button } from '@/components/ui';

/** Print this page (the fact sheets). */
export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()}>
      Print
    </Button>
  );
}
