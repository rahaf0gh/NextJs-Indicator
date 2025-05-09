'use client';

import { useState } from 'react';
import Link from "next/link";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";


type EstablishmentRow = {
  العام: string;
  الربع: string;
  "الكيان القانوني": string;
  المكتب: string;
  "باب النشاط": string;
  "قسم النشاط": string;
  "حجم المنشأة": string;
  "عدد المنشآت المسجلة بمشترك واحد أو أكثر": string;
};

export default function IndicatorPage() {
  const [data, setData] = useState<EstablishmentRow[]>([]);
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<string>("الكل");
  const [selectedSize, setSelectedSize] = useState<string>("الكل");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const fileExtension = file.name.split(".").pop();
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const fileData = event.target?.result;
      if (!fileData) return;
  
      if (fileExtension === "csv") {
        Papa.parse(fileData as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data as EstablishmentRow[]);
          },
        });
      } else if (fileExtension === "xlsx") {
        const workbook = XLSX.read(fileData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // تحويل الورقة إلى CSV
        const csvText = XLSX.utils.sheet_to_csv(worksheet);
  
        // تحليل CSV الناتج
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data as EstablishmentRow[]);
          },
        });
      } else {
        alert("يرجى رفع ملف بصيغة CSV أو Excel (.xlsx)");
      }
    };
  
    // قراءة كـ نص (للـ CSV) أو binary (للـ Excel)
    if (fileExtension === "xlsx") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, "utf-8");
    }
  };

  const allLegalEntities = Array.from(new Set(data.map((row) => row["الكيان القانوني"])));
  const allSizes = Array.from(new Set(data.map((row) => row["حجم المنشأة"])));

  const filteredData = data.filter((row) => {
    const isLegalEntityMatch = selectedLegalEntity === "الكل" || row["الكيان القانوني"] === selectedLegalEntity;
    const isSizeMatch = selectedSize === "الكل" || row["حجم المنشأة"] === selectedSize;
    return isLegalEntityMatch && isSizeMatch;
  });

  const sectionCountByBab = filteredData.reduce((acc, row) => {
    const bab = row["باب النشاط"];
    const section = row["قسم النشاط"];
    if (!acc[bab]) {
      acc[bab] = new Set();
    }
    acc[bab].add(section);
    return acc;
  }, {} as Record<string, Set<string>>);

  const chartData1 = Object.entries(sectionCountByBab).map(([name, sections]) => ({
    name,
    value: sections.size,
  }));

  const sizeCountBySize = filteredData.reduce((acc, row) => {
    const size = row["حجم المنشأة"];
    const count = parseInt(row["عدد المنشآت المسجلة بمشترك واحد أو أكثر"]) || 0;
    acc[size] = (acc[size] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const totalByBab = filteredData.reduce((acc, row) => {
    const bab = row["باب النشاط"];
    const count = parseInt(row["عدد المنشآت المسجلة بمشترك واحد أو أكثر"]) || 0;
    acc[bab] = (acc[bab] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  const chartData2 = Object.entries(sizeCountBySize).map(([name, value]) => ({
    name,
    value,
  }));

  const chartData3 = Object.entries(totalByBab).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-6 report-content">
      <h1 className="text-3xl font-bold mb-6">📊 تحليل بيانات المنشآت من ملف </h1>
          
      {/* رفع الملف */}
      <div className="mb-6">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileUpload}
          className="border p-2 rounded"
        />
      </div>
      <Link href="/otherIndicator">
              <button className="btn-outline"> تصفح الملفات</button>
          </Link>

      {data.length > 0 && (
        <>
          {/* بطاقات إحصائية */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-xl p-4 text-center">
              <h2 className="text-xl font-semibold">إجمالي المنشآت</h2>
              <p className="text-2xl text-blue-600 font-bold">{data.length}</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 text-center">
              <h2 className="text-xl font-semibold">عدد أبواب النشاط</h2>
              <p className="text-2xl text-green-600 font-bold">{new Set(data.map((item) => item["باب النشاط"])).size}</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 text-center">
              <h2 className="text-xl font-semibold">عدد الأقسام</h2>
              <p className="text-2xl text-purple-600 font-bold">{new Set(data.map((item) => item["قسم النشاط"])).size}</p>
            </div>
          </div>
          
          {/* filters */}
          <div className="mb-6">
            <label className="font-medium mr-2">الكيان القانوني:</label>
            <select
              value={selectedLegalEntity}
              onChange={(e) => setSelectedLegalEntity(e.target.value)}
              className="border p-2 rounded mr-4"
            >
              <option value="الكل">الكل</option>
              {allLegalEntities.map((legalEntity, index) => (
                <option key={`${legalEntity}-${index}`} value={legalEntity}>
                  {legalEntity || "غير معروف"}
                </option>
              ))}
            </select>


            <label className="font-medium mr-2">حجم المنشأة:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="الكل">الكل</option>
              {allSizes.map((size, index) => (
                <option key={`${size}-${index}`} value={size}>
                  {size || "غير معروف"}
                </option>
              ))}
            </select>
          </div>

          {/* charts */}
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">عدد الأقسام في كل باب نشاط</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData1}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-90} textAnchor="start" height={130} tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const words = value.split(" ");
                  return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : value; }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl shadow md:col-span-1">
              <h2 className="text-lg font-semibold mb-2">حجم المنشآت</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData2}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-90} textAnchor="start" height={100} 
                  tickFormatter={(value) => {
                    const words = value.split(" ");
                    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : value; }}/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">إجمالي المنشآت لكل باب نشاط</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData3}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-90} textAnchor="start" height={110} 
                  tickFormatter={(value) => {
                    const words = value.split(" ");
                    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : value; }}/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
