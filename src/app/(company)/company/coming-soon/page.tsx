import { Suspense } from 'react';
import ComingSoon from '@/components/shared/ComingSoon';

export default function ComingSoonPage() {
  return (
    <Suspense fallback={null}>
      <ComingSoon />
    </Suspense>
  );
}
