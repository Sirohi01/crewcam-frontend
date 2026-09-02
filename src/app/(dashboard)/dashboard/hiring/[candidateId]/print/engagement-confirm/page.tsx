'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import PrintHiringHeader from '@/components/common/PrintHiringHeader';

const SOCIAL_PLATFORMS = ['FB', 'IG', 'LinkedIn', 'X', 'YT'];

const toTitleCase = (str?: string) => {
    if (!str) return '';
    return str.replace(/\b\w/g, c => c.toUpperCase()).replace(/\B\w/g, c => c.toLowerCase());
};

const FONT_FAMILY = 'Poppins, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export default function EngagementConfirmPrintPage() {
    const params = useParams();
    const router = useRouter();
    const candidateId = params?.candidateId as string;

    const { data: records, isLoading } = useQuery<any[]>({
        queryKey: ['engagement-confirmation', candidateId],
        queryFn: async () => {
            const response = await api.get('/hiring/engagement-confirm', { params: { candidateId } });
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading Preview...</p>
            </div>
        );
    }

    const data = records && records.length > 0 ? records[records.length - 1] : null;

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    const handlePrint = () => { window.print(); };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const InlineField = ({
        label,
        value,
        labelWidth = 140,
        titleCase = false,
    }: {
        label: string;
        value?: string;
        labelWidth?: number;
        titleCase?: boolean;
    }) => (
        <div style={{
            display: 'flex', alignItems: 'baseline',
            fontSize: 11, fontWeight: 700, color: '#0f172a',
            fontFamily: FONT_FAMILY,
        }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth, fontFamily: FONT_FAMILY }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6, fontFamily: FONT_FAMILY }}>:</span>
            <span className="print-line" style={{
                borderBottom: '1px solid #cbd5e1', flex: 1, minWidth: 0,
                paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                fontWeight: 500, fontSize: 11, wordBreak: 'break-word',
                display: 'inline-block', lineHeight: '1.4',
                fontFamily: FONT_FAMILY,
            }}>
                {titleCase ? toTitleCase(value) : (value || '\u00A0')}
            </span>
        </div>
    );

    const Divider = () => (
        <div style={{ borderTop: '1.5px solid #475569', margin: '10px 0 7px 0' }} className="print-divider" />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 style={{
            fontSize: 13, fontWeight: 600, color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginTop: 0, marginBottom: 7,
            fontFamily: FONT_FAMILY,
        }}>
            {children}
        </h3>
    );

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight">SM-ENGAGEMENT PREVIEW</h1>
            </div>

            <div className="flex items-center justify-between no-print mb-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    BACK TO FORM
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#0d3c68] text-white px-3 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all"
                >
                    <Printer className="h-3.5 w-3.5" />
                    PRINT FORM
                </button>
            </div>

            <div className="max-w-[900px] mx-auto print:w-full print:max-w-full print:mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-0">
                <div className="print:p-0">

                    <PrintHiringHeader
                        title="SM-ENGAGEMENT CONFIRMATION FORM"
                        subtitle="Employee Follow / Engagement / Review Responsibility"
                        step={19}
                    />

                    <section style={{ marginBottom: 8 }}>
                        <SectionTitle>1. Employee Information</SectionTitle>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                            <InlineField label="Employee Name"         labelWidth={160} value={data.employeeName || data.candidateName}    titleCase />
                            <InlineField label="Unique ID (if issued)" labelWidth={160} value={data.uniqueId} />
                            <InlineField label="Department"            labelWidth={160} value={data.department}      titleCase />
                            <InlineField label="Designation"           labelWidth={160} value={data.designation}     titleCase />
                            <InlineField label="Joining Date"          labelWidth={160} value={formatDate(data.joiningDate)} />
                            <InlineField label="Official Mobile No"    labelWidth={160} value={data.officialMobileNo} />
                        </div>
                    </section>

                    <Divider />

                    <section style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 7 }}>
                            <h3 style={{
                                fontSize: 13, fontWeight: 600, color: '#0f172a',
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                                margin: 0, fontFamily: FONT_FAMILY,
                            }}>
                                2. Follow/Subscribe Verification
                            </h3>
                            <span style={{
                                fontSize: 10, fontStyle: 'italic', color: '#475569',
                                fontWeight: 500, fontFamily: FONT_FAMILY,
                            }}>
                                (Tick ✓ by Employee and HR)
                            </span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: FONT_FAMILY }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th style={{ border: '1px solid #0f172a', padding: '4px 6px', width: 40, textAlign: 'center', fontWeight: 700, fontSize: 11, color: '#0f172a', fontFamily: FONT_FAMILY }}>S.No.</th>
                                    <th style={{ border: '1px solid #0f172a', padding: '4px 6px', textAlign: 'center', fontWeight: 700, fontSize: 11, color: '#0f172a', fontFamily: FONT_FAMILY }}>Brand / Page</th>
                                    {SOCIAL_PLATFORMS.map(p => (
                                        <th key={p} style={{ border: '1px solid #0f172a', padding: '4px 6px', width: 44, textAlign: 'center', fontWeight: 700, fontSize: 11, color: '#0f172a', fontFamily: FONT_FAMILY }}>{p}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.engagementData?.map((row: any, i: number) => (
                                    <tr key={i}>
                                        <td style={{ border: '1px solid #0f172a', padding: '3px 6px', textAlign: 'center', fontWeight: 500, fontSize: 11, fontFamily: FONT_FAMILY }}>{i + 1}.</td>
                                        <td style={{ border: '1px solid #0f172a', padding: '3px 6px', fontWeight: 700, fontSize: 11, color: '#0f172a', fontFamily: FONT_FAMILY }}>{row.brand}</td>
                                        {SOCIAL_PLATFORMS.map(p => (
                                            <td key={p} style={{ border: '1px solid #0f172a', padding: '3px 6px', textAlign: 'center', fontFamily: FONT_FAMILY }}>
                                                {row.platforms?.[p]
                                                    ? <span style={{ fontWeight: 700, fontSize: 13 }}>✓</span>
                                                    : <div style={{ width: 12, height: 12, border: '1px solid #475569', margin: '0 auto' }} />}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <Divider />

                    <section style={{ marginBottom: 8 }}>
                        <SectionTitle>3. Employee Social Media Engagement Commitment</SectionTitle>
                        <div style={{
                            fontSize: 11, fontWeight: 700,
                            color: '#0f172a', marginBottom: 6, fontFamily: FONT_FAMILY,
                        }}>
                            I hereby confirm and agree that:
                        </div>
                        <ul style={{
                            listStyleType: 'disc', paddingLeft: 20,
                            fontSize: 11, color: '#0f172a', margin: 0,
                            display: 'flex', flexDirection: 'column', gap: 4,
                            textAlign: 'justify', lineHeight: 1.5,
                            fontWeight: 500, fontFamily: FONT_FAMILY,
                        }}>
                            <li>I will regularly <strong>Like, Comment, and Share all important posts</strong> published on the official social media pages of the Company and its associated brands.</li>
                            <li>I will not post any negative or inappropriate comments about the Company on any platform.</li>
                            <li>I will arrange at least <strong>10 nos genuine Google Review</strong> for each brand/page listed above, ensuring all reviews follow ethical and positive communication guidelines.</li>
                            <li>I understand that social media engagement is part of my professional responsibility and supports the Company's branding efforts.</li>
                            <li>Any misuse of social media, including posting harmful content, may result in disciplinary action.</li>
                        </ul>
                    </section>

                    <Divider />

                    <section style={{ marginBottom: 8 }}>
                        <SectionTitle>4. Employee Declaration</SectionTitle>
                        <div style={{
                            fontSize: 11, fontStyle: 'italic', fontWeight: 500,
                            color: '#475569', marginBottom: 14,
                            textAlign: 'justify', fontFamily: FONT_FAMILY,
                        }}>
                            I confirm that all the above information is accurate and that I have fulfilled the required actions.
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                            <InlineField label="Employee Name" labelWidth={160} value={data.employeeName || data.candidateName} titleCase />
                            <InlineField label="Date" labelWidth={160} value={formatDate(data.signatureDate)} />
                        </div>
                    </section>

                    <Divider />

                    <section style={{ marginBottom: 8 }}>
                        <SectionTitle>5. HR Verification</SectionTitle>
                        <div style={{
                            fontSize: 11, fontStyle: 'italic', fontWeight: 500,
                            color: '#475569', marginBottom: 14,
                            textAlign: 'justify', fontFamily: FONT_FAMILY,
                        }}>
                            I verify that the employee has completed the required follow/engagement actions.
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                            <InlineField label="HR Name & Signature" labelWidth={160} value={data.hrName} titleCase />
                            <InlineField label="Date" labelWidth={160} value={formatDate(data.hrVerificationDate)} />
                        </div>
                    </section>

                    <div className="hidden print:block" style={{
                        textAlign: 'right', fontSize: '10px',
                        fontWeight: 600, color: '#64748b', marginTop: 40,
                        fontFamily: FONT_FAMILY,
                    }}>
                        Page 1 / 1
                    </div>

                </div>
            </div>

            <style>{`
                @media print {
                    .max-w-\\[900px\\] { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    .p-6, .md\\:p-8 { padding: 0 !important; }
                    @page { size: A4 portrait; margin: 1.3cm; }
                    *, *::before, *::after {
                        box-sizing: border-box !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    html, body, #root, .page-container, main, div#__next {
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
                    .print-divider { border-top: 1.5px solid #475569 !important; }
                    .print-line { border-bottom: 1px solid #cbd5e1 !important; }
                    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                    *::-webkit-scrollbar { display: none !important; }
                    tr { page-break-inside: avoid; }
                    p, span, div, li, h2, h3, h4, td, th {
                        font-family: Poppins, Inter, -apple-system, BlinkMacSystemFont,
                            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    }
                }
                @media screen {
                    .print-only { display: none !important; }
                }
            `}</style>
        </div>
    );
}
