'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getData } from '../view-data/dataFetcher';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ChartPage() {
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

  if (!url || !format) return <p className="p-5 text-red-600">رابط غير صالح</p>;
  if (data.length === 0) return <p className="p-5">جاري تحميل البيانات...</p>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      {extraKey ? (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
          <Bar dataKey={extraKey} fill="#82ca9d" />
        </BarChart>
      ) : (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
