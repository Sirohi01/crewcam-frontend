'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function JoiningConfirmationTemplate({ candidateId }: { candidateId: string }) {
    const [record, setRecord] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchRecord(candidateId);
    }, [candidateId]);

    const fetchRecord = async (id: string) => {
        try {
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            const res = await api.get('/hiring/joining-confirmation', { params: { candidateId: id } });
            let recordData = Array.isArray(res.data) ? res.data[0] : (res.data.data?.[0] || res.data);

            if (recordData) {
                setRecord({
                    ...recordData,
                    candidateName: candidateData ? `${candidateData.firstName} ${candidateData.lastName || ''}`.trim() : recordData.candidateName,
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setRecord(null);
            }
        } catch (error: any) {
            toast.error('Failed to fetch Joining Confirmation details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading Confirmation Preview...</p>
            </div>
        );
    }

    if (!record) return <div className="p-10 text-center text-red-500 font-bold">Record not found.</div>;

    const formattedJoiningDate = record.confirmedJoiningDate || record.joiningDate
        ? new Date(record.confirmedJoiningDate || record.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '___________________';

    const formattedFailureDate = record.failureToReportDate
        ? new Date(record.failureToReportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : formattedJoiningDate;

    // ── Shared text style — matches img2 body font weight & size ──
    const bodyStyle: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 500,
        textAlign: 'justify',
        color: '#0f172a',
        lineHeight: '1.5',
    };

    const boldInline: React.CSSProperties = { fontWeight: 700 };

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white">
            <div
                className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]"
            >
                <div>
                    <PrintHiringHeader
                        title="JOINING CONFIRMATION MAIL"
                        subtitle="(HR Operations Segment)"
                        step={6}
                    />

                    {/* Content */}
                    <div style={{ padding: '0 4px' }}>
                        {/* Subject — with thick divider below */}
                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            paddingBottom: 6,
                            borderBottom: '1.5px solid #475569',
                            marginBottom: 8,
                        }}>
                            <span style={{ ...bodyStyle, fontWeight: 700, whiteSpace: 'nowrap', minWidth: 50 }}>Subject:</span>
                            <span style={{ ...bodyStyle, fontWeight: 700, flex: 1 }}>
                                {record.subject || `Official Joining Confirmation – ${record.candidateName} – ${record.designation}`}
                            </span>
                        </div>

                        {/* Salutation */}
                        <p style={{
                            ...bodyStyle,
                            fontWeight: 700,
                            marginBottom: 8,
                        }}>
                            Dear Mr./Ms. {record.candidateName},
                        </p>

                        {/* Para 1 */}
                        <p style={{ ...bodyStyle, marginBottom: 8, textAlign: 'justify' }}>
                            This email serves as the <span style={boldInline}>formal and legal confirmation</span> of your joining at{' '}
                            <span style={boldInline}>Design House India Pvt. Ltd.</span> for the position of{' '}
                            <span style={boldInline}>{record.designation}</span>, as per the terms outlined in your Letter of Intent (LOI) and subsequent discussions.
                        </p>

                        {/* Reporting Details */}
                        <div style={{ marginBottom: 8 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: -2, marginBottom: 7 }}>
                                You are required to report as follows:
                            </h3>
                            <div style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {[
                                    { label: 'Joining Date', value: formattedJoiningDate },
                                    { label: 'Reporting Time', value: record.reportingTime || '9:30 AM' },
                                    { label: 'Reporting Location', value: record.reportingLocation || 'Head Office – Mohan Nagar, Ghaziabad' },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'baseline', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                                        <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 140 }}>{label}</span>
                                        <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                        <span style={{ fontWeight: 500, flex: 1, fontSize: 13, color: '#0f172a' }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upon Reporting */}
                        <div style={{ marginBottom: 8 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: -2, marginBottom: 7 }}>
                                Upon reporting, you will be required to:
                            </h3>
                            <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {[
                                    'Complete all HR, onboarding, and compliance formalities.',
                                    'Sign your Offer Letter and Appointment Letter, along with all statutory and organizational agreements.',
                                    'Bring all original documents for verification, along with the self-attested photocopies requested in your LOI.',
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                                        <span style={{ ...bodyStyle, fontWeight: 500, flexShrink: 0 }}>{i + 1}.</span>
                                        <span style={{ ...bodyStyle, fontWeight: 500 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notice paragraphs */}
                        <p style={{ ...bodyStyle, marginBottom: 8, textAlign: 'justify' }}>
                            Please ensure that all original documents requested in your LOI are brought on the day of joining. Failure to provide the required documents may delay or affect the <span style={{ fontWeight: 700, }}>onboarding process</span>.
                        </p>

                        <p style={{ ...bodyStyle, marginBottom: 8, textAlign: 'justify' }}>
                            Kindly note that{' '}
                            <span style={{ fontWeight: 700, }}>failure to report on {formattedFailureDate} without prior written approval</span>{' '}
                            may result in the{' '}
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>automatic withdrawal of this offer</span>, at the sole discretion of the management.
                        </p>

                        <p style={{ ...bodyStyle, marginBottom: 14, textAlign: 'justify' }}>
                            For any clarification regarding your joining process, you may contact the <span style={boldInline}>HR Department</span> during working hours.
                        </p>

                        {/* Closing */}
                        <p style={{ ...bodyStyle, marginBottom: 10 }}>
                            We look forward to welcoming you to Design House India Pvt. Ltd. and to a professional and mutually beneficial association.
                        </p>

                        <div>
                            <p style={{ ...bodyStyle, fontWeight: 600, marginBottom: 14 }}>Thanks & Regards,</p>
                            <p style={{ ...bodyStyle, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Design House India Pvt. Ltd.</p>
                            <p style={{ ...bodyStyle, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2, marginBottom: 2 }}>HR Department</p>
                        </div>

                        <div style={{
                            textAlign: 'right',
                            fontSize: 10,
                            fontWeight: 600,
                            color: '#64748b',
                            marginTop: 20,
                        }}>
                            Page 1 / 1
                        </div>
                    </div>
                </div>
            </div>

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
                    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                    *::-webkit-scrollbar { display: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:bg-white { background: white !important; }
                    /* Force text colors to pure black on print */
                    p, span, h1, h2, h3, h4, h5, h6, div, td, th {
                        color: #000000 !important;
                    }
                }
            `}</style>
        </div>
    );
}
