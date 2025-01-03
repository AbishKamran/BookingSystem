import BookingForm from '@/components/BookingForm';
import { Suspense } from 'react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
