'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import PrintHiringHeader from '@/components/common/PrintHiringHeader';

const toTitleCase = (str?: string) => {
    if (!str) return '';
    return str.replace(/\b\w/g, c => c.toUpperCase()).replace(/\B\w/g, c => c.toLowerCase());
};

const FONT_FAMILY = 'Poppins, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export default function InductionPrintPage() {
    const params = useParams();
    const router = useRouter();
    const candidateId = params?.candidateId as string;

    const { data: records, isLoading } = useQuery<any[]>({
        queryKey: ['induction', candidateId],
        queryFn: async () => {
            const response = await api.get('/hiring/induction', { params: { candidateId } });
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        }
    });

    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        const handleBeforePrint = () => setIsPrinting(true);
        const handleAfterPrint = () => setIsPrinting(false);
        window.addEventListener('beforeprint', handleBeforePrint);
        window.addEventListener('afterprint', handleAfterPrint);
        return () => {
            window.removeEventListener('beforeprint', handleBeforePrint);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 text-[#0d3c68] animate-spin" />
            </div>
        );
    }

    const data = (records && records.length > 0) ? records[records.length - 1] : null;

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">No Induction Record Found</h2>
                    <p className="text-slate-500 mb-6">Please complete the induction schedule form first before attempting to print.</p>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-[#0d3c68] text-white rounded-[2px] font-medium text-sm hover:bg-[#0a2e50] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen bg-slate-100 print:bg-white flex justify-center p-8 print:p-0"
            style={{ fontFamily: FONT_FAMILY }}
        >
            <style>{`
@media print {
  @page { size: A4 portrait; margin: 15mm; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
  .no-print { display: none !important; }
}
`}</style>

            <div className="fixed top-4 right-4 flex flex-col gap-2 no-print z-50">
                <button
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0d3c68] text-white rounded shadow-lg hover:bg-[#0a2e50] transition-colors text-sm font-semibold tracking-wide"
                >
                    <Printer className="h-4 w-4" /> PRINT FORM
                </button>
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded shadow border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-semibold tracking-wide"
                >
                    <ArrowLeft className="h-4 w-4" /> BACK
                </button>
            </div>

            <div 
                className="w-[210mm] min-h-[297mm] bg-white print:w-auto print:min-h-0 relative overflow-hidden shadow-2xl print:shadow-none mx-auto"
            >
                <div className="px-10 pt-10 pb-6 print:px-0 print:pt-0 print:pb-0">
                    <PrintHiringHeader title="INDUCTION SCHEDULE" subtitle="Induction Checklist and Records" />

                    <div className="text-center border-y-2 border-[#0d3c68] py-2 mb-6 mt-4">
                        <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-wider m-0">
                            INDUCTION SCHEDULE & CHECKLIST
                        </h1>
                    </div>

                    <div className="mb-6 border-2 border-slate-900 rounded-sm overflow-hidden">
                        <table className="w-full text-left border-collapse text-[12px]">
                            <tbody>
                                <tr className="border-b border-slate-300">
                                    <td className="py-2 px-3 bg-slate-100 font-bold w-1/4 border-r border-slate-300">Employee Name</td>
                                    <td className="py-2 px-3 font-semibold w-1/4 border-r border-slate-300">{toTitleCase(data.employeeName) || '-'}</td>
                                    <td className="py-2 px-3 bg-slate-100 font-bold w-1/4 border-r border-slate-300">Unique ID</td>
                                    <td className="py-2 px-3 font-semibold w-1/4">{data.uniqueId || '-'}</td>
                                </tr>
                                <tr className="border-b border-slate-300">
                                    <td className="py-2 px-3 bg-slate-100 font-bold border-r border-slate-300">Department</td>
                                    <td className="py-2 px-3 border-r border-slate-300">{data.department || '-'}</td>
                                    <td className="py-2 px-3 bg-slate-100 font-bold border-r border-slate-300">Designation</td>
                                    <td className="py-2 px-3">{data.designation || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 bg-slate-100 font-bold border-r border-slate-300">Joining Date</td>
                                    <td className="py-2 px-3 border-r border-slate-300">
                                        {data.joiningDate ? new Date(data.joiningDate).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                    <td className="py-2 px-3 bg-slate-100 font-bold border-r border-slate-300">Induction Date</td>
                                    <td className="py-2 px-3">
                                        {data.inductionDate ? new Date(data.inductionDate).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-[13px] font-bold text-slate-900 bg-slate-200 px-3 py-1.5 mb-2 uppercase border-l-4 border-[#0d3c68]">
                            Induction Modules Check
                        </h2>
                        <table className="w-full text-left border-collapse border border-slate-900 text-[12px]">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-900">
                                    <th className="py-2 px-3 border-r border-slate-900 font-bold w-12 text-center">S.No.</th>
                                    <th className="py-2 px-3 border-r border-slate-900 font-bold">Module Name</th>
                                    <th className="py-2 px-3 border-r border-slate-900 font-bold w-24 text-center">Completed</th>
                                    <th className="py-2 px-3 border-slate-900 font-bold w-32">Completion Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.modules || []).map((mod: any, idx: number) => (
                                    <tr key={idx} className="border-b border-slate-300 last:border-b-0">
                                        <td className="py-2 px-3 border-r border-slate-900 text-center font-medium">{idx + 1}</td>
                                        <td className="py-2 px-3 border-r border-slate-900">{mod.moduleName}</td>
                                        <td className="py-2 px-3 border-r border-slate-900 text-center font-medium">
                                            {mod.completed ? 'Yes' : 'No'}
                                        </td>
                                        <td className="py-2 px-3">
                                            {mod.completedDate ? new Date(mod.completedDate).toLocaleDateString('en-GB') : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {(!data.modules || data.modules.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-4 px-3 text-center text-slate-500 italic">
                                            No modules specified.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-[13px] font-bold text-slate-900 bg-slate-200 px-3 py-1.5 mb-2 uppercase border-l-4 border-[#0d3c68]">
                            Remarks / Feedback
                        </h2>
                        <div className="border border-slate-900 p-3 min-h-[60px] text-[12px] bg-slate-50">
                            {data.feedback || 'None'}
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8">
                        <div className="text-center">
                            <div className="h-12 border-b border-slate-400 mx-10"></div>
                            <p className="mt-2 text-[12px] font-bold text-slate-800 uppercase">Employee Signature</p>
                            <p className="text-[11px] text-slate-500 mt-1">Date: ________________</p>
                        </div>
                        <div className="text-center">
                            <div className="h-12 border-b border-slate-400 mx-10"></div>
                            <p className="mt-2 text-[12px] font-bold text-slate-800 uppercase">HR / Manager Signature</p>
                            <p className="text-[11px] text-slate-500 mt-1">Date: ________________</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 pt-4 border-t border-slate-200 print:mt-auto print:absolute print:bottom-4 print:w-full">
                    <p className="text-[9px] text-slate-400 font-medium">
                        Document Generated on: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Namo Gange HRMS
                    </p>
                </div>
            </div>
        </div>
    );
}
