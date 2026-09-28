'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function LOITemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchRecord(candidateId);
    }, [candidateId]);

    const fetchRecord = async (id: string) => {
        try {
            // Fetch candidate to get basic details
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            // Fetch LOI
            const res = await api.get('/hiring/loi', { params: { candidateId: id } });
            let recordData = Array.isArray(res.data) ? res.data[0] : (res.data.data?.[0] || res.data);

            if (recordData) {
                setData({
                    ...recordData,
                    candidateName: candidateData ? `${candidateData.firstName} ${candidateData.lastName}`.trim() : recordData.candidateName,
                    position: recordData.designation || candidateData?.jobRole || 'N/A',
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to fetch LOI details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading LOI Preview...</p>
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

    const formattedDate = data.joiningDate ? new Date(data.joiningDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '___________________';

    const handlePrint = () => {
        window.print();
    };

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

    const InlineDetail = ({ label, value }: { label: string; value: string }) => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '130px 10px 1fr',
                alignItems: 'baseline',
                fontSize: 11,
                fontWeight: 700,
                color: '#0f172a',
            }}
        >
            <span>{label}</span>
            <span>:</span>
            <span>{value}</span>
        </div>
    );

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            {/* Screen Header - Hidden on print */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins">LETTER OF INTENT (LOI)</h1>
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
                        className="flex items-center gap-2 bg-[#0d3c68] text-white px-5 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all"
                    >
                        <Printer className="h-4 w-4" />
                        PRINT LOI
                    </button>
                </div>
            </div>

            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                <div>
                    <PrintHiringHeader
                        title="LETTER OF INTENT (LOI)"
                        subtitle="(Recruitment Division)"
                        step={5}
                    />

                    {/* Content Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                        <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a' }}>
                            Dear <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{data.candidateName}</span>,
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.6 }}>
                                With reference to your application for employment and the subsequent interview process, we are pleased to inform you that you have been selected for the position of <span style={{ fontWeight: 700 }}>{data.position}</span> at <span style={{ fontWeight: 700 }}>Design House India Pvt. Ltd.</span>
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.6 }}>
                                This Letter of Intent confirms our mutual understanding regarding your proposed employment. The detailed <span style={{ fontWeight: 700 }}>Appointment Letter</span>, containing your compensation structure and complete terms and conditions, will be issued upon joining or after completion of internal formalities.
                            </p>
                        </div>

                        {/* Joining Details — Row 1: Joining Date + Reporting Time | Row 2: Reporting Location full width */}
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: -2, marginBottom: 7 }}>
                                You are requested to join as per the details below:
                            </p>
                            {/* Row 1: two fields side by side */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 40px', marginBottom: 6 }}>
                                <InlineDetail label="Joining Date" value={formattedDate} />
                                <InlineDetail label="Reporting Time" value={data.reportingTime || '9:30 AM'} />
                            </div>
                            {/* Row 2: Reporting Location full width */}
                            <div>
                                <InlineDetail label="Reporting Location" value={data.reportingLocation || 'Head Office – Ghaziabad'} />
                            </div>
                        </div>

                        <Divider />

                        {/* Section 1: Documents Required */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <SectionTitle>1. Documents Required at the Time of Joining</SectionTitle>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', lineHeight: 1.6, margin: 0 }}>
                                Please bring the following documents (originals for verification and self-attested copies for submission):
                            </p>
                            <ol style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', paddingLeft: 20, margin: 0, lineHeight: 1.6 }}>
                                <li style={{ marginBottom: 2 }}>Four (4) latest passport-size color photographs</li>
                                <li style={{ marginBottom: 2 }}>Self-attested copies &amp; originals of:
                                    <ul style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', paddingLeft: 20, marginTop: 2, lineHeight: 1.6 }}>
                                        <li>10th/12th, Graduation, Post-Graduation certificates</li>
                                        <li>Any technical/professional qualification certificates</li>
                                    </ul>
                                </li>
                                <li style={{ marginBottom: 2 }}>Self-attested copies &amp; originals of previous employment documents:
                                    <ul style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', paddingLeft: 20, marginTop: 2, lineHeight: 1.6 }}>
                                        <li>Experience letters &amp; Relieving letter from last organization</li>
                                    </ul>
                                </li>
                                <li style={{ marginBottom: 2 }}>Self-attested copies of last 3 months' salary slips and last 3 months' bank statement</li>
                                <li style={{ marginBottom: 2 }}>Self-attested copies &amp; originals of PAN Card and Aadhaar Card</li>
                                <li style={{ marginBottom: 2 }}>Bank passbook copies or cancelled cheque (for salary account details)</li>
                                <li style={{ marginBottom: 2 }}>Laptop (to be brought daily as discussed)</li>
                                <li style={{ marginBottom: 2 }}>Aadhaar Card details of your parents or Spouse</li>
                            </ol>
                        </div>

                        <Divider />

                        {/* Section 2: Conditions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <SectionTitle>2. Conditions</SectionTitle>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.5, margin: 0 }}>
                                This offer is subject to successful verification of your documents and references, clearance of background checks, and confirmation that you are medically fit.
                            </p>
                        </div>

                        <Divider />

                        {/* Section 3: Acceptance */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <SectionTitle>3. Acceptance</SectionTitle>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.5, margin: 0 }}>
                                Instead of signing, kindly <span style={{ fontWeight: 700 }}>send an email confirmation</span> acknowledging your acceptance of this Letter of Intent.
                            </p>
                        </div>

                        <Divider />

                        {/* Footer */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 500, color: '#0f172a', textAlign: 'justify', lineHeight: 1.5, margin: 0 }}>
                                We look forward to welcoming you onboard and building a long, productive, and mutually beneficial association.
                            </p>
                            <div style={{ marginTop: 6 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Thanks &amp; Regards,</p>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            textTransform: 'uppercase',
                                            lineHeight: '1.5',
                                        }}
                                    >
                                        <div>DESIGN HOUSE INDIA PVT. LTD.</div>
                                        <div>HR DEPARTMENT</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Page number */}
                        <div className="print-only" style={{
                            textAlign: 'right',
                            fontSize: 10,
                            fontWeight: 500,
                            color: '#64748b',
                            marginTop: 2,
                        }}>
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
                    .data-value {
                        font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 500 !important;
                        line-height: 1.4 !important;
                    }
                    .print-divider { border-top: 1.5px solid #475569 !important; }
                    .print-line { border-bottom: 1px solid #cbd5e1 !important; }
                    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                    *::-webkit-scrollbar { display: none !important; }
                    tr { page-break-inside: avoid; }
                }
                @media screen {
                    .print-only { display: none !important; }
                }
            `}</style>
        </div>
    );
}
