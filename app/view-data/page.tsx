// app/view-data/page.tsx
import { Suspense } from 'react';
import ViewDataClient from './ViewDataClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-5">جاري تحميل البيانات...</div>}>
      <ViewDataClient />
    </Suspense>
  );
}
