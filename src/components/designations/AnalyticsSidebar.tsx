import React from 'react';
import { Plus, GitMerge, Settings2, Upload, GitPullRequest } from 'lucide-react';

function DoughnutChart() {
  return (
    <div className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center shrink-0 mx-auto mt-2" 
         style={{
           background: `conic-gradient(
             #3b82f6 0% 57.1%, 
             #f59e0b 57.1% 85.7%, 
             #a855f7 85.7% 95.2%,
             #10b981 95.2% 100%
           )`
         }}>
      <div className="absolute w-[85px] h-[85px] bg-white rounded-full flex flex-col items-center justify-center">
        <span className="text-[18px] font-bold text-zinc-900 leading-tight">42</span>
        <span className="text-[10px] text-zinc-500 font-medium">Total</span>
      </div>
    </div>
  );
}

function ProgressBar({ grade, count, max }: { grade: string; count: number; max: number }) {
  const percentage = Math.max(2, (count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-[34px] text-[10px] font-bold text-zinc-600 shrink-0">{grade}</div>
      <div className="flex-1 flex items-center">
        <div className="h-[6px] bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
      <div className="w-[20px] text-right text-[10px] font-bold text-zinc-800 shrink-0">{count}</div>
    </div>
  );
}

export default function AnalyticsSidebar() {
  const JOB_GRADES = [
    { grade: 'JG-10', count: 1 },
    { grade: 'JG-09', count: 3 },
    { grade: 'JG-08', count: 12 },
    { grade: 'JG-07', count: 18 },
    { grade: 'JG-06', count: 45 },
    { grade: 'JG-05', count: 62 },
    { grade: 'JG-04', count: 110 },
    { grade: 'JG-03', count: 168 },
    { grade: 'JG-02', count: 82 },
    { grade: 'JG-01', count: 31 },
  ];
  const maxGrade = Math.max(...JOB_GRADES.map(g => g.count));

  return (
    <div className="space-y-2">
      
      {/* Designation Overview Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Designation Overview</h3>
        <div className="flex gap-4 items-center">
          <DoughnutChart />
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between text-[10.5px]">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Management (6)
              </div>
              <span className="text-zinc-500">24 (57.1%)</span>
            </div>
            <div className="flex items-center justify-between text-[10.5px]">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Professional (6)
              </div>
              <span className="text-zinc-500">12 (28.6%)</span>
            </div>
            <div className="flex items-center justify-between text-[10.5px]">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Leadership (2)
              </div>
              <span className="text-zinc-500">2 (4.8%)</span>
            </div>
            <div className="flex items-center justify-between text-[10.5px]">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Support (2)
              </div>
              <span className="text-zinc-500">4 (9.5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employees by Job Grade Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Employees by Job Grade</h3>
        <div className="space-y-2.5">
          {JOB_GRADES.map((jg) => (
            <ProgressBar key={jg.grade} grade={jg.grade} count={jg.count} max={maxGrade} />
          ))}
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button className="flex items-center gap-1.5 justify-center py-2 px-1 border border-blue-100 bg-blue-50 rounded-lg text-[10.5px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors overflow-hidden">
            <Plus className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Add New Designation</span>
          </button>
          <button className="flex items-center gap-1.5 justify-center py-2 px-1 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
            <Settings2 className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Map to Job Grade</span>
          </button>
          <button className="flex items-center gap-1.5 justify-center py-2 px-1 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
            <GitMerge className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Map to Job Family</span>
          </button>
          <button className="flex items-center gap-1.5 justify-center py-2 px-1 border border-zinc-200 bg-white rounded-lg text-[10.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors overflow-hidden">
            <Upload className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Bulk Import</span>
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 py-2 border border-zinc-200 bg-white rounded-lg text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          <GitPullRequest className="w-3.5 h-3.5 text-blue-600" /> View Designation Hierarchy
        </button>
      </div>

    </div>
  );
}
