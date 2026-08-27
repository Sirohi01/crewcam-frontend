'use client';
import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PrintHiringHeader from '@/components/common/PrintHiringHeader';

const EVALUATION_CRITERIA = [
    { id: 1, title: "Job Knowledge & Skills", description: "Understanding of role, processes, and required skills" },
    { id: 2, title: "Quality of Work", description: "Accuracy, attention to detail, and output quality" },
    { id: 3, title: "Productivity & Timeliness", description: "Ability to meet deadlines and manage workload" },
    { id: 4, title: "Communication & Coordination", description: "Communication with team, seniors, and clients" },
    { id: 5, title: "Discipline & Attendance", description: "Punctuality, attendance, and adherence to company policies" },
    { id: 6, title: "Initiative & Attitude", description: "Willingness to learn, take responsibility, and show ownership" },
    { id: 7, title: "Compliance & Conduct", description: "Adherence to Company policies, Code of Conduct, IT & confidentiality rules" }
];

const RATINGS = ["Excellent", "Good", "Average", "Needs Improvement"];
const COMPLIANCE_RATINGS = ["Fully Compliant", "Partially Compliant", "Non-compliant"];

const FONT = 'Poppins, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const toTitleCase = (str?: string) => {
    if (!str) return '';
    return str.replace(/\b\w/g, c => c.toUpperCase());
};

export default function ProbationReviewPrint({ recordId }: { recordId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['probation-review', recordId],
        queryFn: async () => (await api.get(`/hiring/probation-reviews/${recordId}`)).data,
    });

    const handlePrint = () => { window.print(); };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
            <p className="text-slate-500 font-medium">Loading probation review...</p>
        </div>
    );

    if (!data) return <div className="p-10 text-center font-bold text-red-500">Data not found</div>;

    const evals: any[] = data.evaluations || [];

    // ── Reusable components ──
    const InlineField = ({ label, value, labelWidth = 140 }: {
        label: string; value?: string; labelWidth?: number;
    }) => (
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: FONT }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth, fontFamily: FONT }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6, fontFamily: FONT }}>:</span>
            <span className="print-line" style={{
                borderBottom: '1px solid #cbd5e1', flex: 1, minWidth: 0,
                paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                fontWeight: 500, fontSize: 11, wordBreak: 'break-word',
                display: 'inline-block', lineHeight: '1.4', fontFamily: FONT,
            }}>
                {value || '\u00A0'}
            </span>
        </div>
    );

    const Divider = () => (
        <div style={{ borderTop: '1.5px solid #475569', margin: '8px 0 6px 0' }} className="print-divider" />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 style={{
            fontSize: 13, fontWeight: 600, color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginTop: 0, marginBottom: 7, fontFamily: FONT,
        }}>
            {children}
        </h3>
    );

    const SelectedBadge = ({ label }: { label: string }) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{
                display: 'inline-block', width: 10, height: 10,
                border: '1.2px solid #475569', flexShrink: 0,
                backgroundColor: '#0d3c68', position: 'relative',
            }}>
                <span style={{ position: 'absolute', top: -2, left: 0, fontSize: 9, color: 'white', fontWeight: 900 }}>✓</span>
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: FONT }}>{label}</span>
        </div>
    );
    
    const candidateName = data.candidateId?.name || data.candidateId?.firstName ? `${data.candidateId.firstName} ${data.candidateId.lastName || ''}`.trim() : data.employeeName || data.candidateName || '';
    const departmentName = data.departmentId?.name || data.department || '';

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            {/* Screen Header */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2 px-6">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight">PROBATION REVIEW FORM</h1>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between no-print mb-4 px-6">
                <button onClick={() => window.close()} className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" /> CLOSE
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0d3c68] text-white px-3 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all">
                    <Printer className="h-3.5 w-3.5" /> PRINT PROBATION REVIEW
                </button>
            </div>

            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto print:w-[210mm] print:max-w-[210mm] print:mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-0">
                <div className='print:p-[8mm]'>
                    <div className="relative">
                        <PrintHiringHeader
                            title="PROBATION REVIEW FORM"
                            subtitle="(To be completed at the end of the probation period)"
                            step={22}
                        />

                        <div style={{ position: 'relative' }}>

                            {/* 1. EMPLOYEE INFORMATION */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>1. Employee Information</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <InlineField label="Employee Name" labelWidth={190} value={toTitleCase(candidateName)} />
                                    <InlineField label="Unique ID" labelWidth={140} value={data.uniqueId || data.employeeId} />
                                    <InlineField label="Department" labelWidth={190} value={toTitleCase(departmentName)} />
                                    <InlineField label="Designation" labelWidth={140} value={toTitleCase(data.designation || data.jobRole)} />
                                    <InlineField label="Joining Date" labelWidth={190} value={formatDate(data.joiningDate)} />
                                    <InlineField label="Review Date" labelWidth={140} value={formatDate(data.reviewDate)} />
                                    <InlineField
                                        label="Reporting Manager"
                                        labelWidth={190}
                                        value={toTitleCase(data.reportingManager || data.reportingManagerName)}
                                    />
                                </div>
                            </section>

                            <Divider />

                            {/* 2. PERFORMANCE EVALUATION */}
                            <section style={{ marginBottom: 4 }}>
                                <SectionTitle>2. Performance Evaluation</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {EVALUATION_CRITERIA.map((criterion, idx) => {
                                        const ev = evals[idx] || {};
                                        const ratings = criterion.id === 7 ? COMPLIANCE_RATINGS : RATINGS;
                                        const selectedRating = ev.rating;

                                        return (
                                            <div key={criterion.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                                                {/* Title + badge row */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                                                    <div style={{ flex: 1, fontSize: 11, color: '#0f172a', lineHeight: '1.4', fontFamily: FONT }}>
                                                        <span style={{ fontWeight: 700, fontFamily: FONT }}>
                                                            {criterion.id}. {criterion.title}
                                                        </span>
                                                        <span style={{ fontWeight: 500, fontStyle: 'italic', color: '#475569', marginLeft: 4, fontFamily: FONT }}>
                                                            ({criterion.description})
                                                        </span>
                                                    </div>
                                                    <div style={{ flexShrink: 0 }}>
                                                        {selectedRating && ratings.includes(selectedRating)
                                                            ? <SelectedBadge label={selectedRating} />
                                                            : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#94a3b8' }}>–</span>
                                                        }
                                                    </div>
                                                </div>

                                                {/* Comments row — label fixed width 190 matching Employee Info left col */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'flex-start',
                                                    fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: FONT,
                                                }}>
                                                    <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 190, fontFamily: FONT }}>Comments</span>
                                                    <span style={{ flexShrink: 0, marginRight: 6, fontFamily: FONT }}>:</span>
                                                    <div style={{ borderBottom: '1px solid #cbd5e1', flex: 1, minHeight: 18, paddingBottom: 1, paddingLeft: 4 }}>
                                                        <p style={{
                                                            fontSize: 11,
                                                            fontWeight: 500,
                                                            lineHeight: '1.5',
                                                            color: '#0f172a',
                                                            margin: 0,
                                                            wordBreak: 'break-word',
                                                            textAlign: 'justify',
                                                            fontStyle: 'normal',
                                                            fontFamily: FONT,
                                                        }}>
                                                            {ev.comments || ''}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <Divider />

                            {/* 3. OVERALL ASSESSMENT */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>3. Overall Assessment</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: FONT }}>
                                        <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 190, fontFamily: FONT }}>Overall Assessment</span>
                                        <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                        <span style={{ fontWeight: 400, fontFamily: FONT }}>
                                            {data.overallAssessment
                                                ? <SelectedBadge label={data.overallAssessment} />
                                                : <span style={{ fontSize: 10, fontStyle: 'italic', color: '#94a3b8' }}>–</span>
                                            }
                                        </span>
                                    </div>
                                    <InlineField label="Overall Remarks" labelWidth={140} value={data.overallRemarks || ''} />
                                </div>
                            </section>

                            <Divider />

                            {/* 4. FINAL RECOMMENDATION */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>4. Final Recommendation</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a', fontFamily: FONT }}>
                                        <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 190, fontFamily: FONT }}>Final Recommendation</span>
                                        <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                        <span style={{ fontWeight: 500, fontFamily: FONT }}>
                                            {data.finalRecommendation
                                                ? <SelectedBadge label={data.finalRecommendation} />
                                                : <span style={{ fontSize: 11, color: '#94a3b8' }}>–</span>
                                            }
                                        </span>
                                    </div>
                                    <InlineField label="Comments" labelWidth={140} value={data.recommendationComments || ''} />
                                </div>
                                {data.finalRecommendation === "Extend Probation" && (
                                    <div style={{ width: '50%', marginTop: 6 }}>
                                        <InlineField label="Duration" labelWidth={190} value={data.extensionDuration} />
                                    </div>
                                )}
                            </section>

                            <Divider />

                            {/* 5. EMPLOYEE ACKNOWLEDGEMENT */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>5. Employee Acknowledgement</SectionTitle>
                                <div style={{ fontSize: 10, fontStyle: 'italic', color: '#475569', marginBottom: 10, fontFamily: FONT }}>
                                    I acknowledge that this probation review has been discussed with me and I understand the feedback shared.
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <InlineField label="Employee Name & Signature" labelWidth={190} value={'\u00A0'} />
                                    <InlineField label="Date" labelWidth={140} value={formatDate(data.employeeAckDate)} />
                                </div>
                            </section>

                            <Divider />

                            {/* 6. MANAGER & HR APPROVAL */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>6. Manager & HR Approval</SectionTitle>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                        <InlineField label="Reporting Manager Signature" labelWidth={190} value={'\u00A0'} />
                                        <InlineField label="Date" labelWidth={140} value={formatDate(data.reportingManagerDate)} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                        <InlineField label="HR Name & Signature" labelWidth={190} value={toTitleCase(data.hrName)} />
                                        <InlineField label="Date" labelWidth={140} value={formatDate(data.hrDate)} />
                                    </div>
                                </div>
                            </section>

                            {/* NOTE */}
                            <div style={{ marginTop: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 2, fontFamily: FONT }}>Note:</div>
                                <div style={{ fontSize: 10, fontStyle: 'italic', color: '#475569', lineHeight: '1.4', textAlign: 'justify', fontFamily: FONT }}>
                                    This review is conducted as per Company HR policy. Confirmation, extension, or termination shall be governed strictly by Company rules and applicable laws. This document does not override the Appointment Letter or Employment Agreement.
                                </div>
                            </div>
                        </div>

                        {/* Page number */}
                        <div className="hidden print:block" style={{ textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#64748b', marginTop: 12 }}>
                            Page 1 / 1
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Print Styles ── */}
            <style>{`
                @media print {
                    @page { size: A4; margin: 0mm !important; }
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
                    .print-divider { border-top: 1.5px solid #475569 !important; }
                    .print-line { border-bottom: 1px solid #cbd5e1 !important; }
                    * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
                    *::-webkit-scrollbar { display: none !important; }
                    .print\\:w-\\[210mm\\] { width: 210mm !important; }
                    .print\\:max-w-\\[210mm\\] { max-width: 210mm !important; }
                    .print\\:mx-auto { margin-left: auto !important; margin-right: auto !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:p-\\[8mm\\] { padding: 8mm !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:bg-white { background: white !important; }
                    p, span, div, li, h2, h3, h4 {
                        font-family: Poppins, Inter, -apple-system, BlinkMacSystemFont,
                            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    }
                }
            `}</style>
        </div>
    );
}
