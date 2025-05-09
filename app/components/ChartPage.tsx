'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getData } from '../view-data/dataFetcher';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ChartPage = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const format = searchParams.get('format');

  const [data, setData] = useState<any[]>([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [extraKey, setExtraKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!url || !format) return;
      try {
        const res = await getData(url, format);
        setData(res);

        const keys = Object.keys(res[0] || {});
        if (keys.length >= 2) {
          setXKey(keys[0]);
          setYKey(keys[1]);
        }
        if (keys.length >= 3) {
          setExtraKey(keys[2]);
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
      }
    };

    fetchData();
  }, [url, format]);

  const totalItems = data.length;
  const activityGates = new Set(data.map((item) => item[xKey])).size;
  const sections = extraKey ? new Set(data.map((item) => item[extraKey])).size : 0;

  if (!url || !format) return <p className="p-5 text-red-600">رابط غير صالح</p>;
  if (data.length === 0) return <p className="p-5">جاري تحميل البيانات...</p>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-center">📊 عرض البيانات في 3 رسوم</h1>
      <p className='text-center text-red-800 text-md'> قد يختلف عرض الرسوم لاختلاف مواضع الأعمدة في المتصفح</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">إجمالي المنشآت</h3>
          <p className="text-xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">عدد أبواب النشاط</h3>
          <p className="text-xl font-bold">{activityGates}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">عدد الأقسام</h3>
          <p className="text-xl font-bold">{sections}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">الرسم الخطي</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">الرسم العمودي</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {extraKey && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">رسم خطي لمفتاح إضافي: {extraKey}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={extraKey} stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
export default ChartPage;