"use client";
import React from 'react'

import { useEffect, useState } from "react";
import Papa from "papaparse";
import Link from "next/link";
import * as XLSX from "xlsx";


type EstablishmentRow = {
  العام: string;
  الربع: string;
  المكتب: string;
  "باب النشاط": string;
  "قسم النشاط": string;
  "حجم المنشأة": string;
  "عدد المنشآت المسجلة بمشترك واحد أو أكثر": string;
};


// جلب البيانات من ملف
const page = () => {
      const [data, setData] = useState<EstablishmentRow[]>([]);
    
      useEffect(() => {
            fetch("/data/q2-2024.xlsx")
              .then((res) => res.arrayBuffer()) 
              .then((arrayBuffer) => {
                const workbook = XLSX.read(arrayBuffer, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const csv = XLSX.utils.sheet_to_csv(sheet);
        
                Papa.parse<EstablishmentRow>(csv, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (results) => {
                    setData(results.data);
                  },
                });
              });
          }, []);
      
  return (
    <div className='p-6'>
         <div className='flex justify-between'>
            <h1 className="text-2xl font-bold mb-4">📊 مؤشرات الربع الثالث 2024</h1>
                <Link href="/q3/q3-chart">
                    <button className="btn btn-sm">الانتقال للرسم البياني</button>
            </Link>
         </div>
        
        <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm text-right border-collapse">
            <thead className="bg-gray-200 text-gray-700">
            <tr>
                <th className="px-4 py-2 border">المكتب</th>
                <th className="px-4 py-2 border">باب النشاط</th>
                <th className="px-4 py-2 border">قسم النشاط</th>
                <th className="px-4 py-2 border">حجم المنشأة</th>
                <th className="px-4 py-2 border">عدد المنشآت</th>
            </tr>
            </thead>
            <tbody>
            {data.slice(0, 30).map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{row.المكتب}</td>
                <td className="px-4 py-2 border">{row["باب النشاط"]}</td>
                <td className="px-4 py-2 border">{row["قسم النشاط"]}</td>
                <td className="px-4 py-2 border">{row["حجم المنشأة"]}</td>
                <td className="px-4 py-2 border">
                    {Number(row["عدد المنشآت المسجلة بمشترك واحد أو أكثر"]).toLocaleString()}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
);
}

export default page