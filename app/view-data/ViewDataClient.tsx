// app/view-data/ViewDataClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getData } from './dataFetcher';
import Link from 'next/link';

export default function ViewDataClient() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!url || !format) return;

        const fetchedData = await getData(url, format);
        setData(fetchedData);
      } catch (error) {
        console.error('Error reading data:', error);
      }
    };

    fetchData();
  }, [url, format]);

  if (!url || !format) {
    return <div className='p-5 text-red-600'>رابط غير صالح</div>;
  }

  return (
    <div className='p-7'>
      <h2 className='text-2xl font-bold text-center mb-4'>عرض البيانات</h2>
      <p className='text-center text-red-800 text-md'>
        قد يختلف تصميم الجدول عن الملف الأساسي لاختلاف مواضع الأعمدة في المتصفح
      </p>

      <div className='flex justify-between mb-4'>
        <h3 className="text-xl">📊 بيانات العرض</h3>
        <Link href={{ pathname: '/chart', query: { url, format } }}>
          <button className="btn btn-sm">الانتقال للرسم البياني</button>
        </Link>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm text-right border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              {data[0] && Object.keys(data[0]).map((key, index) => (
                <th key={index} className="px-4 py-2 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 border">
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
