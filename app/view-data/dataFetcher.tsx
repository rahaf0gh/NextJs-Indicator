'use server'; // تحديد دالة خادم

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function getData(url, format) {
  const response = await fetch(url);
  const blob = await response.blob();

  if (format.toLowerCase() === 'csv') {
    const text = await blob.text();
    return Papa.parse(text, { header: true }).data;
  } else if (format.toLowerCase() === 'xlsx') {
    const arrayBuffer = await blob.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  }
}
