'use client';

import { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function OfferLetterTemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchRecord(candidateId);
    }, [candidateId]);

    const fetchRecord = async (id: string) => {
        try {
            // Fetch candidate
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            // Fetch Offer Letter
            const res = await api.get('/hiring/offer-letter', { params: { candidateId: id } });
            let recordData = Array.isArray(res.data) ? res.data[0] : (res.data.data?.[0] || res.data);

            if (recordData) {
                setData({
                    ...recordData,
                    candidateName: candidateData ? `${candidateData.firstName} ${candidateData.lastName}`.trim() : recordData.candidateName,
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to fetch Offer Letter details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading Offer Letter Preview...</p>
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

    const formattedDate = data.date || data.createdAt ? new Date(data.date || data.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '___________________';

    const joiningDateStr = data.joiningDate ? new Date(data.joiningDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '___________________';

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            {/* Screen Header - Hidden on print */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins">OFFER LETTER</h1>
            </div>

            {/* Controls - Hidden on print */}
            <div className="flex items-center justify-between no-print mb-4 px-1">
                <button
                    onClick={() => window.close()}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    CLOSE WINDOW
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-[#0d3c68] text-white px-2 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all"
                    >
                        <Printer className="h-4 w-4" />
                        PRINT OFFER LETTER
                    </button>
                </div>
            </div>

            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                <div>

                    <PrintHiringHeader
                        title="OFFER LETTER"
                        subtitle="(For Internal Use – HR Department)"
                        step={13}
                    />

                    {/* Content Section */}
                    <div className="space-y-2" style={{ fontSize: 13, lineHeight: '1.5', color: '#0f172a', fontWeight: 500, textAlign: 'justify' }}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="space-y-1">
                                <p className="font-bold tracking-tight">To,</p>
                                <div className="font-bold">{data.candidateName}</div>
                                <div className="font-bold mt-1">{data.address || '___________________'}</div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <span className="font-bold">Date:</span>
                                <span className="data-value">{formattedDate}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="font-bold underline underline-offset-2">Subject: Offer of Employment</p>

                            <p>
                                Dear <span className="font-bold px-1 ">{data.candidateName}</span>,
                            </p>

                            <p>
                                We are pleased to extend this formal Offer of Employment for the position of <span className="font-bold px-1">{data.designation || '___________________'}</span> at <span className="font-bold uppercase tracking-tight">Design House India Pvt. Ltd.</span> Your selection is based on your qualifications, prior experience, and the positive outcome of your interview. We believe your capabilities align well with our organisational objectives, and we look forward to integrating you into our team.
                            </p>

                            <p>
                                You will be appointed as <span className="font-bold">{data.designation || '___________________'}</span> and will report to the designated Reporting Manager at our <span className="font-bold">{data.location || '___________________'}</span>. Your <span className="font-bold">Monthly Cost-to-Company (CTC) will be ₹{Number(String(data.monthlyCTC || 0).replace(/,/g, '')).toLocaleString('en-IN') || '______'}</span>, amounting to an <span className="font-bold">Annual CTC of ₹{Number(String(data.annualCTC || 0).replace(/,/g, '')).toLocaleString('en-IN') || '______'}</span>, the detailed breakup of which will be provided in your Salary Annexure. Your regular work schedule will be <span className="font-bold">{data.workScheduleDays || 'Monday to Saturday'}, from {data.workScheduleTime || '9:30 AM to 6:30 PM'}</span>, with the understanding that additional working hours may be required depending on operational requirements.
                            </p>

                            <p>
                                Your joining date has been scheduled for <span className="font-bold">{joiningDateStr}</span>, and you are required to report at <span className="font-bold">{data.joiningTime || '9:30 AM'}</span> at the {data.location || 'Head Office'}. In case you are unable to join on the scheduled date, you must inform the HR Department in writing at the earliest, so appropriate instructions may be issued.
                            </p>

                            <p>
                                Your employment shall begin with a <span className="font-bold">probation period of {data.probationPeriod || '6 Months'}</span>. During this period, your performance, conduct, and adherence to company standards will be assessed. Confirmation of employment will be subject to successful completion of probation and approval from the management.
                            </p>

                            <p>
                                By accepting this offer, you confirm that you are not bound by any contractual, legal, or professional restrictions from any previous employer that may hinder your joining or continuation of employment. You also confirm that all information and documents provided during the recruitment process are true, complete, and accurate, and that you will not carry, use, or disclose any proprietary or confidential information belonging to any previous employer.
                            </p>

                            <p>
                                This offer shall remain valid for <span className="font-bold">seven (7) days</span> from the date of issuance. If you wish to accept the position, please confirm your acceptance by email within this period. Failure to do so may lead to automatic withdrawal of the offer without any further obligation on the part of the Company.
                            </p>

                            <p>
                                To confirm your acceptance, you may reply to this email with the following statement:<br />
                                <span className="font-bold">"I hereby accept the Offer Letter issued by Design House India Pvt. Ltd. and agree to join on the scheduled date under the stated terms and conditions."</span>
                            </p>

                            <p>
                                We look forward to welcoming you to the Design House India team and trust that your association with us will be productive, professional, and mutually rewarding.
                            </p>
                        </div>

                        <div className="pt-2 space-y-2">
                            <div>
                                <p className="font-bold text-slate-800">Thanks & Regards,</p>
                                <p className="font-bold text-slate-900 text-[11px] mt-0.5">Design House India Pvt. Ltd.</p>
                                <div className="mt-2">
                                    <span className="font-black text-[12px] text-slate-900 uppercase tracking-tighter">HR Department</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-[12px]">Accepted By :</span>
                                    <div className="w-48 border-b border-black/20"></div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <span className="font-bold text-[12px]">Date :</span>
                                    <div className="w-32 border-b border-black/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page number */}
                    <div className="text-right text-[10px] text-[#64748b] font-bold mt-2 hidden print:block">
                        Page 1 / 1
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .max-w-\\[900px\\] { max-width: 100% !important; margin: 0 !important; }
                    @page { size: A4 portrait; margin: 0; }
                    * { 
                        box-sizing: border-box !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    html, body, #root, .page-container, main, .min-h-screen {
                        background: white !important;
                        background-color: white !important;
                        overflow: visible !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .no-print { display: none !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:max-w-full { max-width: 100% !important; }
                    .print\\:mx-auto { margin-left: auto !important; margin-right: auto !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:p-\\[8mm\\] { padding: 8mm !important; }
                    .print\\:mb-0 { margin-bottom: 0 !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .font-black { font-weight: 700 !important; }
                    .font-bold { font-weight: 600 !important; }
                   .data-value {
    font-family: 'Calibri', 'Inter', 'Segoe UI', Arial, sans-serif !important;
    font-weight: 600 !important;
    padding-bottom: 2px !important;
    display: inline-flex !important;
    align-items: flex-end !important;
    line-height: 1 !important;
    margin-bottom: 0 !important;
}
                }
            `}</style>
        </div>
    );
}
