import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui.jsx';
import { api } from '../lib/api.js';

const reports = [
  { label: 'Sales report', pdf: '/api/reports/sales?format=pdf', excel: '/api/reports/sales?format=xlsx' },
  { label: 'Inventory report', pdf: '/api/reports/inventory?format=pdf', excel: '/api/reports/inventory?format=xlsx' },
  { label: 'Expense report', pdf: '/api/reports/expenses?format=pdf', excel: '/api/reports/expenses?format=xlsx' }
];

async function downloadReport(url, filename) {
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader><CardTitle>Reports and Export</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report) => (
          <div key={report.label} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <div className="font-medium">{report.label}</div>
              <div className="text-sm text-slate-500">Download as PDF or Excel</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => downloadReport(report.pdf, `${report.label}.pdf`)}>PDF</Button>
              <Button onClick={() => downloadReport(report.excel, `${report.label}.xlsx`)}>Excel</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
