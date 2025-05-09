import { Suspense } from 'react'
import ChartPage from './ChartPage'

export default function Page() {
  return (
    <Suspense fallback={<p className="p-5">جاري تحميل الرسم البياني...</p>}>
      <ChartPage />
    </Suspense>
  )
}
