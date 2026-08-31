'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function CTCBreakupTemplate({ candidateId }: { candidateId: string }) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchDetail(candidateId);
    }, [candidateId]);

    const fetchDetail = async (id: string) => {
        try {
            // Fetch candidate to get basic details
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            // Fetch CTC Breakup
            const ctcRes = await api.get('/hiring/ctc-breakup', { params: { candidateId: id } });
            let ctcData = Array.isArray(ctcRes.data) ? ctcRes.data[0] : (ctcRes.data.data?.[0] || ctcRes.data);

            if (ctcData) {
                setData({
                    ...ctcData,
                    candidateName: candidateData ? `${candidateData.firstName} ${candidateData.lastName}`.trim() : ctcData.candidateName,
                    position: ctcData.position || candidateData?.jobRole,
                    department: ctcData.department || 'N/A',
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to load CTC details');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading CTC breakup...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-10 text-center">
                <p className="font-bold text-red-500 mb-4">No data found. Please go back and try again.</p>
                <button
                    onClick={() => window.close()}
                    className="flex items-center gap-2 mx-auto text-[#0d3c68] font-bold text-sm"
                >
                    <ArrowLeft className="h-4 w-4" />
                    CLOSE
                </button>
            </div>
        );
    }

    // Calculations
    const grossStr = String(data.monthlyGross || '0').replace(/,/g, '');
    const gross = parseFloat(grossStr) || 0;
    const basic = gross * 0.5;
    const hra = gross * 0.3;
    const otherAllowance = gross * 0.2;

    const employeePF = basic > 15000 ? 1800 : basic * 0.12;
    const employeeESI = gross <= 21000 ? gross * 0.0075 : 0;

    const employerPF = basic > 15000 ? 1800 : basic * 0.12;
    const employerESI = gross <= 21000 ? gross * 0.0325 : 0;

    const netTakeHome = gross - (employeePF + employeeESI);
    const annualCTC = gross * 12;

    const Divider = () => (
        <div style={{ borderTop: '1.5px solid #475569', margin: '10px 0 7px 0' }} className="print-divider" />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 style={{
            fontSize: 13, fontWeight: 600, color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginTop: -2, marginBottom: 7,
        }}>
            {children}
        </h3>
    );

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            {/* Screen Header - Hidden on print */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-1">STAFF CTC BREAKUP</h1>
            </div>

            {/* Screen Controls - Hidden on print */}
            <div className="flex items-center justify-between no-print mb-4 px-1">
                <button
                    onClick={() => window.close()}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    CLOSE WINDOW
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#0d3c68] text-white px-5 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all"
                >
                    <Printer className="h-3.5 w-3.5" />
                    PRINT CTC BREAKUP
                </button>
            </div>

            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                <div>
                    <div className="relative">
                        <PrintHiringHeader
                            title="SALARY STRUCTURE CONFIRMATION LETTER"
                            subtitle="(Filled by HR Division)"
                            step={4}
                        />

                        {/* Recipient and Date */}
                        <div className="flex justify-between items-start mb-2 text-[11px] font-bold" style={{ color: '#0f172a' }}>
                            <div className="flex flex-col gap-1 w-[280px]">
                                <span>To,</span>
                                <div className={`min-h-[1.5rem] flex items-start ${!data.candidateName ? 'border-b border-black' : ''}`}>
                                    <span className=" pb-0.5 ">{data.candidateName}</span>
                                </div>
                            </div>
                            <div className="flex items-end gap-2 justify-end pt-2">
                                <span>Date:</span>
                                <span className="data-value">
                                    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="mb-2 text-[11px] font-bold uppercase underline underline-offset-4" style={{ color: '#0f172a' }}>
                            Subject: Salary Structure Confirmation
                        </div>

                        {/* Salutation and Body */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                Dear <span style={{ textTransform: 'capitalize' }}>{data.dear || data.candidateName}</span>,
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.6 }}>
                                We are pleased to share your detailed <span style={{ fontWeight: 700 }}>Salary Structure / CTC Breakup</span> for the position of <span style={{ fontWeight: 700 }} className="data-value">{data.position}</span> (Department: <span style={{ fontWeight: 700 }} className="data-value">{data.department}</span>) at <span style={{ fontWeight: 700 }}>Design House India Pvt. Ltd.</span>, effective from <span style={{ fontWeight: 700 }} className="data-value">{new Date(data.effectiveDate || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>.
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.6 }}>
                                Your total monthly <span style={{ fontWeight: 700 }}>Cost-to-Company (CTC)</span> is <span style={{ fontWeight: 700 }}>₹{gross.toLocaleString('en-IN')}</span> and the breakup as per company salary policy and statutory norms is given below:
                            </p>
                        </div>

                        <Divider />

                        {/* CTC Breakup Section */}
                        <section className="mb-2">
                            <SectionTitle>
                                CTC BREAKUP (MONTHLY)
                            </SectionTitle>
                            <div className="grid grid-cols-2 gap-x-12">
                                {/* Left Side: Earnings Table */}
                                <div>
                                    <table className="w-full border-collapse border border-black">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="border border-black p-1.5 text-[11px] font-bold uppercase text-center bg-slate-50/10">
                                                    Earnings (Monthly)
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border border-black p-1.5 text-[10px] font-bold uppercase text-left">Component</th>
                                                <th className="border border-black p-1.5 text-[10px] font-bold uppercase text-right w-28">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] text-slate-900 font-medium font-poppins">
                                            <tr>
                                                <td className="border border-black p-1.5">• Earnings (Gross Salary: ₹{gross.toLocaleString('en-IN')})</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{gross.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5">• Basic Salary (50%)</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{basic.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5">• HRA (30%)</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{hra.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5">• Other Allowance (20%)</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{otherAllowance.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5 font-bold uppercase text-[10px]">Monthly Gross Salary</td>
                                                <td className="border border-black p-1.5 text-right font-bold text-[11px]"><span className="data-value">₹{gross.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Side: Deductions Table */}
                                <div>
                                    <table className="w-full border-collapse border border-black">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} className="border border-black p-1.5 text-[11px] font-bold uppercase text-center bg-slate-50/10">
                                                    Statutory Deductions
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="border border-black p-1.5 text-[10px] font-bold uppercase text-left">Deduction</th>
                                                <th className="border border-black p-1.5 text-[10px] font-bold uppercase text-right w-28">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] text-slate-900 font-medium font-poppins">
                                            <tr>
                                                <td className="border border-black p-1.5">• Statutory Deductions (Employee)</td>
                                                <td className="border border-black p-1.5 text-right font-bold italic">Deducted</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5">• Employee PF (12%)</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{employeePF.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5">• Employee ESI (0.75%)</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{employeeESI.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5 ">Total Deductions</td>
                                                <td className="border border-black p-1.5 text-right font-bold"><span className="data-value">₹{(employeePF + employeeESI).toLocaleString('en-IN')}</span></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-1.5 font-bold uppercase text-[10px]">Net Take-Home Salary</td>
                                                <td className="border border-black p-1.5 text-right font-bold text-[11px]"><span className="data-value">₹{netTakeHome.toLocaleString('en-IN')}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p className="text-[9px] text-right mt-1 italic text-slate-500 font-bold">per month</p>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Employer Contributions Section */}
                        <section className="mb-2">
                            <SectionTitle>
                                Employer Contributions (Included in CTC)
                            </SectionTitle>
                            <div className="grid grid-cols-2 gap-x-12 px-1">
                                <div className="flex justify-between items-center text-[11px] font-bold ">
                                    <span className="text-slate-700">• Employer PF (12%):</span>
                                    <span className="data-value">₹{employerPF.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold  ">
                                    <span className="text-slate-700">• Employer ESI (3.25%):</span>
                                    <span className="data-value">₹{employerESI.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* Annual CTC Section */}
                        <section className="mb-2">
                            <SectionTitle>
                                Annual CTC
                            </SectionTitle>
                            <p className="text-[11px] font-semibold" style={{ color: '#0f172a' }}>
                                ₹{gross.toLocaleString('en-IN')} × 12 = ₹{annualCTC.toLocaleString('en-IN')} per annum
                            </p>
                        </section>

                        <Divider />

                        {/* Employee Acceptance */}
                        <div className="mb-1">
                            <SectionTitle>
                                Employee Acceptance
                            </SectionTitle>
                            <div style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.6, marginTop: 4 }}>
                                <p>
                                    <strong>I,</strong> <span style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4, margin: '0 4px' }} className="data-value">{data.candidateName}</span>, hereby confirm that I have read, understood, and accepted the above Salary Structure as part of my employment with <span style={{ fontWeight: 700 }}>Design House India Pvt. Ltd.</span>
                                </p>
                            </div>
                        </div>

                        {/* Signature Area */}
                        <div className="grid grid-cols-2 gap-20 mb-4">
                            <div className="space-y-2">
                                <div className="border-b border-black flex items-end h-8">
                                    <span className="text-[11px] font-bold">Employee Signature:</span>
                                    <span className="flex-1 border-b border-dotted border-slate-400 mx-2"></span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="border-b border-black flex items-end h-8">
                                    <span className="text-[11px] font-bold">Signature Date:</span>
                                    <span className="flex-1 border-b border-dotted border-slate-400 mx-2"></span>
                                </div>
                            </div>
                        </div>

                        {/* For Company Use Only Area */}
                        <div className="mt-0">
                            <h3 className="text-[11px] font-bold mb-2 uppercase tracking-wider" style={{ color: '#0f172a' }}>For Company Use Only</h3>
                            <div className="grid grid-cols-2 gap-20">
                                <div className="flex items-end justify-between gap-8">
                                    <div className="flex items-end gap-2 flex-1">
                                        <span className="text-[11px] font-bold whitespace-nowrap">
                                            HR Signature:
                                        </span>
                                        <span className="flex-1 border-b border-black"></span>
                                    </div>

                                    <div className="flex items-end gap-2 flex-1">
                                        <span className="text-[11px] font-bold whitespace-nowrap">
                                            Signatory Name:
                                        </span>
                                        <span className="flex-1 border-b border-black"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page 1 number */}
                        <div className="absolute -bottom-40 right-4 text-[9px] text-[#64748b] font-semibold hidden print:block">
                            Page 1 / 1
                        </div>
                    </div>
                </div>
            </div>
            {/* Print Styles */}
            <style>{`
                @media print {
                    .max-w-\\[900px\\] { max-width: 100% !important; margin: 0 !important; }
                    @page { size: A4 portrait; margin: 0; }
                *, *::before, *::after {
                    box-sizing: border-box !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                html, body, #root, .page-container, main {
                    background: white !important;
                    overflow: visible !important;
                    height: auto !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100% !important;
                }
                .no-print { display: none !important; }
                .print-only { display: block !important; }
                section { page-break-inside: avoid; break-inside: avoid; }
                
                /* Force text colors to pure black on print to avoid light/grey appearance */
                .data-value, p, span, h1, h2, h3, h4, h5, h6, div, td, th {
                    color: #000000 !important;
                }
                
                .data-value {
                    font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
                    font-weight: 500 !important;
                    line-height: 1.4 !important;
                }
                
                .print-divider { border-top: 1.5px solid #475569 !important; }
                .print-line { border-bottom: 1px solid #cbd5e1 !important; }
                * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                *::-webkit-scrollbar { display: none !important; }
                table { border-collapse: collapse !important; border-color: #000 !important; }
                th, td { border-color: #000 !important; }
                tr { page-break-inside: avoid; }
            }
            `}</style>
        </div>
    );
}
