'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function IndividualAttendanceDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  const { data: records, isLoading, isError, error } = useQuery({
    queryKey: ['attendance', 'individual', userId],
    queryFn: async () => (await api.get(`/attendance/individual/${userId}`)).data,
    retry: false,
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1000px] mx-auto">
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Individual Attendance</h1>
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Full attendance history for this employee</p>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <History size={16} className="text-indigo-600" /> History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : isError ? (
            <div className="py-8 text-center text-sm text-rose-600 border border-dashed rounded-lg">
              {(error as any)?.response?.data?.message || 'Not authorized to view this employee\'s attendance.'}
            </div>
          ) : records?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No attendance records found.</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Date</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Clock In</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Clock Out</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Total Hours</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {records?.map((record: any) => (
                    <tr key={record._id} className="border-b transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 align-middle font-medium">{moment(record.date).format('MMM DD, YYYY')}</td>
                      <td className="p-4 align-middle text-emerald-600">{moment(record.clockInTime).format('hh:mm A')}</td>
                      <td className="p-4 align-middle">{record.clockOutTime ? moment(record.clockOutTime).format('hh:mm A') : '-'}</td>
                      <td className="p-4 align-middle">{record.totalHours ? record.totalHours.toFixed(2) + ' hrs' : '-'}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-md bg-emerald-100 text-emerald-800">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
