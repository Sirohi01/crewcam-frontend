'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

export default function IndividualAttendancePickerPage() {
  const currentUser = useAuthStore((s) => s.user);

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees', 'picker'],
    queryFn: async () => (await api.get('/employees')).data,
    retry: false,
  });

  const list = Array.isArray(employees) ? employees : employees?.data || [];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-6 max-w-[800px] mx-auto">
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Individual Attendance</h1>
        <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-md">Drill into one employee&apos;s attendance history</p>
      </div>

      <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-md">Select Employee</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser && (
            <Link
              href={`/dashboard/attendance/individual/${currentUser.id}`}
              className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm mb-2 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
            >
              <User size={14} className="text-indigo-600" /> My Own Attendance
            </Link>
          )}
          {isLoading ? (
            <div className="py-4 text-center text-sm text-zinc-500">Loading employees...</div>
          ) : list.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500 border border-dashed rounded-lg">No employees in scope.</div>
          ) : (
            <ul className="flex flex-col gap-1">
              {list.map((emp: any) => (
                <li key={emp._id}>
                  <Link
                    href={`/dashboard/attendance/individual/${emp._id}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <span className="font-medium">{emp.firstName} {emp.lastName}</span>
                    <span className="text-zinc-500 text-xs">{emp.email}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
