import React from 'react'

export default async function PostPage() {
  const response = await fetch('https://open.data.gov.sa/data/api/datasets/resources?version=-1&dataset=31af324f-d2b5-459a-9824-f27f8adef5fd',
    {
      next: {
        revalidate: 60
      }
    }
  );
  const todo = await response.json();

  // فلترة البيانات لعرض فقط ملفات xlsx و csv وباللغة العربية
const arabicRegex = /[\u0600-\u06FF]/;

const filteredResources = todo.resources.filter(resource =>
  (resource.format?.toLowerCase() === 'xlsx' || resource.format?.toLowerCase() === 'csv') &&
  arabicRegex.test(resource.name)
);


  return(
    <div className='p-7'>
      <h2 className='text-center text-2xl font-bold mb-4'>مصادر بيانات أخرى</h2>  
      <p className='text-center text-red-800 text-md'>
        قد يختلف تصميم الجدول عن الملف الأساسي لاختلاف مواضع الأعمدة في المتصفح
      </p> 
        <div className="overflow-x-auto border rounded-lg shadow">

          <table className="min-w-full text-sm text-right border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">الاسم</th>
                <th className="px-4 py-2 border">عرض البيانات</th>
                <th className="px-4 py-2 border">رابط التحميل</th>
                <th className="px-4 py-2 border">تاريخ التحديث</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{resource.name}</td>
                  <td className="px-4 py-2 border"><a
                    href={`/view-data?url=${encodeURIComponent(resource.downloadUrl)}&format=${resource.format}`}
                    className="text-blue-600 hover:underline"
                  >
                    عرض البيانات
                  </a></td>
                  <td className="px-4 py-2 border"><a href={resource.downloadUrl} target="_blank" rel="noopener noreferrer">
                    تحميل الملف
                  </a></td>
                  <td className="px-4 py-2 border">{resource.updatedAt}</td>
                  
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
  )
}
