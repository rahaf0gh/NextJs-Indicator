import Papa from 'papaparse';
import * as XLSX from 'xlsx';
export async function getData(url: string, format: string): Promise<any[]> {
  console.log('Fetching from:', url);

  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

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

    throw new Error('Unsupported file format');
  } catch (err) {
    console.error('getData error:', err.message);
    throw err;
  }
}
