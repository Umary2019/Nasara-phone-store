import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../lib/api.js';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui.jsx';
import { formatDateTime } from '../lib/utils.js';

export default function AuditLogPage() {
  const { data } = useQuery({ queryKey: ['audit'], queryFn: () => apiGet('/audit') });
  const items = data?.items || [];
  return (
    <Card>
      <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <table className="w-full">
            <TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Actor</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <tbody>{items.map((log) => <TableRow key={log._id}><TableCell className="font-medium">{log.action}</TableCell><TableCell>{log.entityType}</TableCell><TableCell>{log.actorName || '-'}</TableCell><TableCell>{formatDateTime(log.createdAt)}</TableCell></TableRow>)}</tbody>
          </table>
        </Table>
      </CardContent>
    </Card>
  );
}
