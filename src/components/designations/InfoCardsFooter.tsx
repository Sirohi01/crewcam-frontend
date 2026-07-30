import React from 'react';
import { Info, CheckCircle2, HeadphonesIcon, ClipboardCheck } from 'lucide-react';

export default function InfoCardsFooter() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
      {/* About Designations */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-600 shrink-0 bg-blue-50/50">
          <Info size={16} />
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-zinc-900 mb-1.5">About Designations</h3>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Designations define roles and responsibilities within the organization. Map them to job grades and job families for better structure and reporting.
          </p>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-purple-600 shrink-0 bg-purple-50/50">
          <ClipboardCheck size={16} />
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-zinc-900 mb-1.5">Best Practices</h3>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-1.5 text-[11px] text-zinc-600">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[1px]" />
              Keep designation titles clear and role-specific.
            </li>
            <li className="flex items-start gap-1.5 text-[11px] text-zinc-600">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[1px]" />
              Map designations to correct job grades and families.
            </li>
            <li className="flex items-start gap-1.5 text-[11px] text-zinc-600">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-[1px]" />
              Review and update designations regularly.
            </li>
          </ul>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-blue-600 shrink-0 bg-blue-50/50">
          <HeadphonesIcon size={16} />
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-zinc-900 mb-1.5">Need Help?</h3>
          <p className="text-[11px] text-zinc-500 leading-relaxed mb-3">
            Learn how to manage designations effectively in Crewcam HRMS.
          </p>
          <button className="px-3 py-1.5 rounded-md border border-blue-200 text-blue-600 text-[11px] font-semibold hover:bg-blue-50 transition-colors bg-white">
            View Help Guide
          </button>
        </div>
      </div>
    </div>
  );
}
