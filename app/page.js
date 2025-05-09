"use client"
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              src="/image/HomePage-img.png"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
            <h2 className="font-bold text-3xl mb-3">مرحبا بــك</h2>
            <p className="font-semibold mb-2">في لوحة مؤشرات المنشآت التجارية في المملكة!</p>
            <p>استكشف بيانات دقيقة وحديثة عن نشاط المنشآت في جميع مناطق المملكة، وتعرف على أبرز الاتجاهات التجارية، وراقب النمو والتغيّر في السوق.</p>
            <p className="mt-2">سواء كنت باحثًا، رائد أعمال، أو مهتمًا بالاقتصاد، هنا تجد الأدوات التي تساعدك على فهم الواقع واتخاذ قرارات أفضل.</p>
                        
            <div className="mt-3">
              <Link href="/indicator">
                  <button className="ml-3 btn">المؤشرات</button>
                </Link>

                <Link href="/previewFile">
                  <button className="btn-outline">تحميل ملف</button>
                </Link>
            </div>
              
            </div>
          </div>
        </div>
        
 
    </div>

  );
}

