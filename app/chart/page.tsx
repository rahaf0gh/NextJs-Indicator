import { Suspense } from "react";
import ChartPage from '../components/ChartPage';

export default function Page() {
  return (
    <div className="p-8 space-y-8">
      <Suspense fallback={<p className="p-5">جاري تحميل الرسم البياني...</p>}>
        <ChartPage />
      </Suspense>
    </div>
  );
}
