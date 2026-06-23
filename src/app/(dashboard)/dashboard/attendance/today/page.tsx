'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import moment from 'moment';

export default function TodayAttendancePage() {
  const { data: records, isLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => (await api.get('/attendance/today')).data,
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[1200px] mx-auto">
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Today Attendance</h1>
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Scoped to your team/department/org per your role</p>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md flex items-center gap-2">
            <Users size={16} className="text-indigo-600" /> Clock-In Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading...</div>
          ) : records?.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No one has clocked in yet today.</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Employee</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Clock In</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Clock Out</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-zinc-500">Status</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-zinc-500">Detail</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {records?.map((record: any) => (
                    <tr key={record._id} className="border-b transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                      <td className="p-4 align-middle font-medium">
                        {record.userId?.firstName} {record.userId?.lastName}
                        <div className="text-xs font-normal text-zinc-500">{record.userId?.email}</div>
                      </td>
                      <td className="p-4 align-middle text-emerald-600">{moment(record.clockInTime).format('hh:mm A')}</td>
                      <td className="p-4 align-middle">{record.clockOutTime ? moment(record.clockOutTime).format('hh:mm A') : '-'}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-md bg-emerald-100 text-emerald-800">{record.status}</span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Link href={`/dashboard/attendance/individual/${record.userId?._id}`} className="text-xs font-medium text-indigo-600 hover:underline">
                          View History
                        </Link>
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
