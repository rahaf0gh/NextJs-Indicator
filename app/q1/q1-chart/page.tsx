"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";
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
  const [selectedBab, setSelectedBab] = useState<string>("الكل");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<string>("الكل");
  const [selectedSize, setSelectedSize] = useState<string>("الكل");

  useEffect(() => {
    fetch("/data/q1-2024.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data as EstablishmentRow[]);
          },
        });
      });
  }, []);

  const allBabs = Array.from(new Set(data.map((row) => row["باب النشاط"])));
  const allLegalEntities = Array.from(new Set(data.map((row) => row["الكيان القانوني"])));
  const allSizes = Array.from(new Set(data.map((row) => row["حجم المنشأة"])));

  const filteredData = data.filter((row) => {
    const isBabMatch = selectedBab === "الكل" || row["باب النشاط"] === selectedBab;
    const isLegalEntityMatch = selectedLegalEntity === "الكل" || row["الكيان القانوني"] === selectedLegalEntity;
    const isSizeMatch = selectedSize === "الكل" || row["حجم المنشأة"] === selectedSize;
    return isBabMatch && isLegalEntityMatch && isSizeMatch;
  });

  // حساب عدد الأقسام لكل "باب النشاط"
  const sectionCountByBab = filteredData.reduce((acc, row) => {
    const bab = row["باب النشاط"];
    const section = row["قسم النشاط"];
    if (!acc[bab]) {
      acc[bab] = new Set(); // استخدام مجموعة لتخزين الأقسام الفريدة
    }
    acc[bab].add(section); // إضافة القسم إلى المجموعة
    return acc;
  }, {} as Record<string, Set<string>>);

  // تحويل البيانات إلى تنسيق مناسب للرسم البياني
  const chartData1 = Object.entries(sectionCountByBab).map(([name, sections]) => ({
    name,
    value: sections.size, // عدد الأقسام الفريدة في كل باب نشاط
  }));

  // حساب عدد المنشآت حسب "حجم المنشأة"
  const sizeCountBySize = filteredData.reduce((acc, row) => {
    const size = row["حجم المنشأة"];
    const count = parseInt(row["عدد المنشآت المسجلة بمشترك واحد أو أكثر"]) || 0;
    acc[size] = (acc[size] || 0) + count;
    return acc;
  }, {} as Record<string, number>);

  // إجمالي عدد المنشآت لكل "باب النشاط"
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
    <div className="p-7 sm:p-2">
      <h1 className="text-3xl font-bold mb-6">📈 مؤشرات المنشآت التجارية - الربع الأول 2024</h1>
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

      <div className="p-6">
        <div className="mb-6 flex-col sm:flex-row">

          <div className="flex items-center">
          <label className="font-medium me-1">اختر الكيان القانوني:</label>
          <select
            value={selectedLegalEntity}
            onChange={(e) => setSelectedLegalEntity(e.target.value)}
            className="border p-2 rounded mr-4 w-56"
          >
            <option value="الكل">الكل</option>
            {allLegalEntities.map((legalEntity) => (
              <option key={legalEntity} value={legalEntity}>
                {legalEntity}
              </option>
            ))}
          </select>
          </div>
          
          <div className="flex items-center  mt-3">
          <label className="font-medium me-8">اختر حجم المنشأة:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border p-2 rounded w-56"
          >
            <option value="الكل">الكل</option>
            {allSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          </div>
          
        </div>

        {/* الرسم البياني الاول */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            عدد الأقسام في كل باب نشاط {selectedBab === "الكل" ? "جميع الأبواب" : selectedBab}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData1}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" dy={0} interval={0} angle={-90} textAnchor="start" height={130} tick={{fontSize: 12}}
              tickFormatter={(value) => {
                const words = value.split(" ");
                return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : value; }}
              />
              <YAxis dx={-20} />
              <Tooltip />
              <Legend 
              formatter={(value) => {
                return `باب النشاط : ${value}`;
              }}
              />
              <Bar dataKey="value" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* الرسم البياني الثاني */}
          <div className="bg-white p-4 rounded-xl shadow md:col-span-1">
            <h2 className="text-lg font-semibold mb-2">
              حجم المنشآت في {selectedBab === "الكل" ? "جميع الأبواب" : selectedBab}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-90} textAnchor="start" height={100} />
                <YAxis dx={-55} />
                <Tooltip />
                <Legend 
                formatter={(value) => {
                  // تغيير تسمية value إلى اسم العمود 
                  return `حجم المنشآت : ${value}`;
                }}
                />
                <Bar dataKey="value" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* الرسم البياني الثالث */}
          <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">
              إجمالي عدد المنشآت في كل باب نشاط
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData3}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" dy={0} interval={0} angle={-90} textAnchor="start" height={110} tick={{fontSize: 10}}
                  tickFormatter={(value) => {
                    const words = value.split(" ");
                    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : value; }}
                />
                <YAxis dx={-50} />
                <Tooltip />
                <Legend 
                 formatter={(value) => {
                  // تغيير تسمية value إلى اسم العمود 
                  return ` باب النشاط : ${value}`;
                }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
