'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

// ── Capitalize first letter of every word ──────────────────────────────────
const toTitleCase = (str?: string) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1));
};

const limitWords = (text?: string, maxWords = 4) => {
    if (!text) return '';
    return text
        .trim()
        .split(/\s+/)
        .slice(0, maxWords)
        .join(' ');
};

export default function DocumentChecklistTemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchDetail(candidateId);
    }, [candidateId]);

    const fetchDetail = async (id: string) => {
        try {
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            const res = await api.get('/hiring/doc-checklist', { params: { candidateId: id } });
            let recordData = Array.isArray(res.data) ? res.data[0] : (res.data.data?.[0] || res.data);

            if (recordData) {
                setData({
                    ...recordData,
                    employeeName: candidateData ? `${candidateData.firstName} ${candidateData.lastName || ''}`.trim() : recordData.employeeName,
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to load checklist details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading document checklist...</p>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    // ── Date formatter ──────────────────────────────────────────────────────
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const Divider = () => (
        <div
            className="print-divider"
            style={{ borderTop: '1.5px solid #475569', margin: '8px 0 5px 0' }}
        />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#0f172a',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: -2,
            marginBottom: 7,
        }}>
            {children}
        </h3>
    );

    const InlineField = ({
        label,
        value,
        labelWidth = 140,
    }: {
        label: string;
        value?: string;
        labelWidth?: number;
    }) => (
        <div style={{
            display: 'flex',
            alignItems: 'baseline',
            fontSize: 11,
            fontWeight: 700,
            color: '#0f172a',
        }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
            <span
                className="print-line"
                style={{
                    borderBottom: '1px solid #cbd5e1',
                    flex: 1,
                    minWidth: 0,
                    paddingBottom: 1,
                    paddingLeft: 4,
                    paddingRight: 4,
                    fontWeight: 500,
                    fontSize: 11,
                    wordBreak: 'break-word',
                    display: 'inline-block',
                    lineHeight: '1.4',
                    textTransform: 'capitalize',
                }}
            >
                {value || '\u00A0'}
            </span>
        </div>
    );

    const CheckBox = ({ checked }: { checked: boolean }) => (
        <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 11, height: 11,
            border: '1.2px solid #475569',
            backgroundColor: checked ? '#0d3c68' : 'white',
            flexShrink: 0,
            position: 'relative',
        }}>
            {checked && (
                <span style={{
                    position: 'absolute', top: -2, left: 0,
                    fontSize: 9, color: 'white', fontWeight: 900, lineHeight: 1,
                }}>✓</span>
            )}
        </span>
    );

    const cats = data.categories || [];
    let page1Cats: any[] = [];
    let page2Cats: any[] = [];
    let rowCount = 0;
    for (const cat of cats) {
        const catRows = 1 + (cat.items?.length || 0);
        if (rowCount + catRows <= 27 && page2Cats.length === 0) {
            page1Cats.push(cat);
            rowCount += catRows;
        } else {
            page2Cats.push(cat);
        }
    }

    const renderTable = (categories: any[]) => {
        if (!categories || categories.length === 0) return null;
        return (
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #475569',
                fontSize: 11,
                tableLayout: 'fixed',
                marginBottom: 8,
            }}>
                <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '41%' }} />
                </colgroup>
                <thead>
                    <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ border: '1px solid #475569', padding: '4px 3px', fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>S.NO</th>
                        <th style={{ border: '1px solid #475569', padding: '4px 6px', fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>DOCUMENT</th>
                        <th style={{ border: '1px solid #475569', padding: '4px 3px', fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>SUBMITTED</th>
                        <th style={{ border: '1px solid #475569', padding: '4px 3px', fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>VERIFIED</th>
                        <th style={{ border: '1px solid #475569', padding: '4px 6px', fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat: any) => (
                        <React.Fragment key={cat.title}>
                            <tr>
                                <td colSpan={5} style={{ border: '1px solid #475569', padding: '3px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: '#e8eef5' }}>
                                    {cat.title}
                                </td>
                            </tr>
                            {cat.items.map((item: any, idx: number) => (
                                <tr key={item._id || idx}>
                                    <td style={{ border: '1px solid #475569', padding: '3px 6px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#0f172a' }}>{idx + 1}</td>
                                    <td style={{ border: '1px solid #475569', padding: '3px 8px', fontSize: 10, fontWeight: 500, color: '#0f172a', textAlign: 'justify', wordBreak: 'break-word', hyphens: 'auto' }}>{item.name}</td>
                                    <td style={{ border: '1px solid #475569', padding: '3px 6px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CheckBox checked={!!item.submitted} /></span>
                                    </td>
                                    <td style={{ border: '1px solid #475569', padding: '3px 6px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><CheckBox checked={!!item.verified} /></span>
                                    </td>
                                    <td style={{ border: '1px solid #475569', padding: '3px 8px', fontSize: 10, fontWeight: 500, fontStyle: item.remarks ? 'normal' : 'normal', color: '#475569', textAlign: 'justify', wordBreak: 'break-word', whiteSpace: 'normal', hyphens: 'auto', lineHeight: '1.35', verticalAlign: 'middle' }}>
                                        {limitWords(item.remarks, 6) || '\u00A0'}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white">
            {/* ═══════════════════════════════════════════
                PAGE 1
            ═══════════════════════════════════════════ */}
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                <div>
                    <PrintHiringHeader
                        title="DOCUMENT RECEIPT & VERIFICATION CHECKLIST"
                        subtitle="(To be completed during employee onboarding)"
                        step={7}
                    />

                    <div style={{ position: 'relative' }}>
                        {/* ── A. Employee Details ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>1. Employee Details</SectionTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', padding: '0 4px' }}>
                                <InlineField label="Employee Name" labelWidth={140} value={toTitleCase(data.employeeName)} />
                                <InlineField label="Date of Joining" labelWidth={140} value={formatDate(data.dateOfJoining)} />
                                <InlineField label="Designation" labelWidth={140} value={toTitleCase(data.designation)} />
                                <InlineField label="Work Location" labelWidth={140} value={toTitleCase(data.workLocation)} />
                                <InlineField label="Department" labelWidth={140} value={toTitleCase(data.department)} />
                                <InlineField label="Employee Code" labelWidth={140} value={data.employeeCode} />
                            </div>
                        </section>

                        <Divider />

                        {/* ── B. Document Submission Intro ── */}
                        <section style={{ marginBottom: 8 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', lineHeight: '1.5' }}>
                                2. DOCUMENT SUBMISSION <span style={{ fontWeight: 500 }}>(By Employee)</span>
                                &nbsp;&nbsp;I&nbsp;
                                <span style={{
                                    borderBottom: '1px solid #cbd5e1',
                                    paddingBottom: 1, paddingLeft: 2, paddingRight: 1,
                                    fontWeight: 500, fontSize: 11,
                                }}>
                                    {toTitleCase(data.employeeName) || '\u00A0'}
                                </span>
                                &nbsp;hereby submit the following documents for verification.
                            </p>
                        </section>

                        {/* ── Checklist Table Page 1 ── */}
                        {renderTable(page1Cats)}
                    </div>

                    <div style={{ textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#64748b', marginTop: 8 }}>
                        {page2Cats.length > 0 ? 'Page 1 / 2' : 'Page 1 / 1'}
                    </div>
                </div>
            </div>

            {/* ── Page Break ── */}
            {page2Cats.length > 0 && (
                <>
                    {/* ═══════════════════════════════════════════
                        PAGE 2
                    ═══════════════════════════════════════════ */}
                    <div
                        className="max-w-[900px] mx-auto print:w-full print:max-w-full print:mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-0 mt-6 print:mt-0"
                        style={{ breakBefore: 'page', pageBreakBefore: 'always', paddingTop: 0 }}
                    >
                        <div className="print:p-0">
                            {/* Step 7 badge */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10, marginTop: 4 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Step 7
                                </span>
                            </div>

                            <div style={{ position: 'relative' }}>
                                {/* ── Checklist Table Page 2 ── */}
                                {renderTable(page2Cats)}

                                {/* ── C. Employee Declaration ── */}
                                <section style={{ marginBottom: 8, marginTop: 16 }}>
                                    <SectionTitle>3. Employee Declaration</SectionTitle>
                                    <p style={{ fontSize: 10.5, fontWeight: 500, fontStyle: 'italic', color: '#475569', marginBottom: 10 }}>
                                        I declare that the information and documents submitted by me are true, correct and complete.
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', padding: '0 4px' }}>
                                        <InlineField label="Employee Name" labelWidth={140} value={toTitleCase(data.employeeName)} />
                                        <InlineField label="Employee Signature" labelWidth={140} value="" />
                                        <InlineField label="Signature Date" labelWidth={140} value={formatDate(data.employeeSignatureDate)} />
                                        <div />
                                    </div>
                                </section>

                                <Divider />

                                {/* ── D. HR Verification ── */}
                                <section style={{ marginBottom: 8 }}>
                                    <SectionTitle>4. HR Verification Section</SectionTitle>
                                    <div style={{ padding: '0 4px', marginBottom: 8 }}>
                                        <InlineField label="HR Remarks" labelWidth={140} value={toTitleCase(data.hrRemarks || '')} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', padding: '0 4px' }}>
                                        <InlineField label="HR Name" labelWidth={140} value={toTitleCase(data.hrName || '')} />
                                        <InlineField label="HR Signature" labelWidth={140} value="" />
                                        <InlineField label="Signature Date" labelWidth={140} value={formatDate(data.hrSignatureDate)} />
                                        <div />
                                    </div>
                                </section>
                            </div>

                            <div style={{ textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#64748b', marginTop: 16 }}>
                                Page 2 / 2
                            </div>
                        </div>
                    </div>
                </>
            )}

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
                    section { page-break-inside: avoid; break-inside: avoid; }
                    tr { page-break-inside: avoid !important; break-inside: avoid !important; }
                    tr:has(td[colspan]) { page-break-after: avoid !important; }
                    .data-value {
                        font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
                        font-weight: 500 !important;
                        line-height: 1.4 !important;
                    }
                    .print-divider { border-top: 1.5px solid #475569 !important; }
                    .print-line { border-bottom: 1px solid #cbd5e1 !important; }
                    table, th, td { border-color: #475569 !important; }
                    thead tr { background-color: #f1f5f9 !important; }
                    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                    *::-webkit-scrollbar { display: none !important; }
                    .print-page-break {
                        display: block !important;
                        page-break-before: always !important;
                        break-before: page !important;
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print\\:p-0            { padding: 0 !important; }
                    .print\\:p-\\[8mm\\]    { padding: 8mm !important; }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:max-w-full { max-width: 100% !important; }
                    .print\\:mx-auto        { margin-left: auto !important; margin-right: auto !important; }
                    .print\\:shadow-none    { box-shadow: none !important; }
                    .print\\:bg-white       { background: white !important; }
                    .print\\:mb-0           { margin-bottom: 0 !important; }
                    .print\\:mt-0           { margin-top: 0 !important; }
                    /* Force text colors to pure black on print */
                    p, span, h1, h2, h3, h4, h5, h6, div, td, th {
                        color: #000000 !important;
                    }
                }
                @media screen {
                    .print-page-break { display: none; }
                }
            `}</style>
        </div>
    );
}
