import React from 'react';
import { Award, Users, Map, UserMinus, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function SummaryCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['designationStats'],
    queryFn: async () => {
      const res = await api.get('/designations/stats');
      return res.data;
    }
  });

  const summaryData = [
    {
      title: 'Total Designations',
      value: isLoading ? '...' : (stats?.total || 0).toString(),
      subtitle: `${stats?.active || 0} Active`,
      icon: Shield,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border border-blue-100',
    },
    {
      title: 'Total Employees',
      value: isLoading ? '...' : (stats?.employees || 0).toString(),
      subtitle: 'Holding Designations',
      icon: Users,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border border-emerald-100',
    },
    {
      title: 'Job Grades Used',
      value: isLoading ? '...' : (stats?.uniqueJobGrades || 0).toString(),
      subtitle: 'Across Designations',
      icon: Award,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 border border-purple-100',
    },
    {
      title: 'Job Families',
      value: isLoading ? '...' : (stats?.familyCounts?.filter((f: any) => f.name !== 'Unassigned').length || 0).toString(),
      subtitle: 'Mapped',
      icon: Map,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border border-amber-100',
    },
    {
      title: 'Vacant Positions',
      value: isLoading ? '...' : (stats?.vacant || 0).toString(),
      subtitle: 'Open Across Designations',
      icon: UserMinus,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border border-teal-100',
    }
  ];

  return (
<<<<<<< Updated upstream
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {summaryData.map((item, index) => (
        <div key={index} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
            <item.icon size={20} />
=======
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {SUMMARY_DATA.map((item, index) => (
        <div key={index} className="bg-white rounded-xl border border-zinc-200 p-3 shadow-sm flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}>
            <item.icon size={16} />
>>>>>>> Stashed changes
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-500 mb-0.5">{item.title}</p>
            <p className="text-xl font-bold text-zinc-900 leading-tight mb-1">{item.value}</p>
            <p className="text-[10px] text-zinc-500">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
