"use client";
import Link from "next/link";

export default  function IndicatorsPage() {

  return (
    
    <main className="p-8">
      <div className="card-container">
        <h1 className="text-2xl font-bold mb-4"> أحدث المؤشرت عام 2024</h1>
        <div className="cards hero-content flex-col lg:flex-row-reverse">
          <div className="card w-96 bg-base-100 card-sm shadow-sm">
            <div className="card-body">
              <h2 className="card-title">الربع الثالث</h2>
              <p>يعرض بيانات الربع الثالث مع رسم بياني</p>
              <div className="justify-end card-actions">
                <Link href="/q3/q3-indicator">
                  <button className="btn btn-sm">اكتشف</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-96 bg-base-100 card-sm shadow-sm">
            <div className="card-body">
              <h2 className="card-title">الربع الثاني</h2>
              <p>يعرض بيانات الربع الثاني مع رسم بياني</p>
              <div className="justify-end card-actions">
                <Link href="q2/q2-indicator">
                  <button className="btn btn-sm">اكتشف</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="card w-96 bg-base-100 card-sm shadow-sm">
            <div className="card-body">
              <h2 className="card-title">الربع الأول</h2>
              <p>يعرض بيانات الربع الأول مع رسم بياني</p>
              <div className="justify-end card-actions">
                <Link href="/q1/q1-indicator">
                  <button className="btn btn-sm">اكتشف</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="cards hero-content flex-col justify-end lg:flex-row-reverse my-4">
        <div className="card w-96 bg-base-100 card-sm shadow-sm">
            <div className="card-body">
              <h2 className="card-title">الربع الرابع</h2>
              <p>يعرض بيانات الربع الرابع مع رسم بياني</p>
              <div className="justify-end card-actions">
                <Link href="/q4/q4-indicator">
                  <button className="btn btn-sm">اكتشف</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

       
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">📊 مؤشرات أخرى</h1>
      
      <Link href="/otherIndicator">
        <button className="mx-3 btn">انقر هنا</button>
      </Link>
      </div>
      
      
    </main>
  );
}




