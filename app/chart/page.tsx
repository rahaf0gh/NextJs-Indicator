'use client';

import { Suspense } from 'react';
// import ChartPage from '../components/ChartPage';

export default function Page({ChartPage}) {
  return (
    <div className="p-8 space-y-8">
      <Suspense>
        {ChartPage}
      </Suspense>
    </div>
  );
}
