'use client';
import React, { useState, useEffect } from 'react';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import PrintHiringHeader from '@/components/common/PrintHiringHeader';

export default function SelectionApprovalPrint({ recordId }: { recordId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['selection-approval', recordId],
        queryFn: async () => (await api.get(`/hiring/selection-approvals/${recordId}`)).data,
    });

    const handlePrint = () => window.print();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading selection approval note...</p>
            </div>
        );
    }

    if (!data) return <div className="p-8 text-center text-red-500">Data not found</div>;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const InlineField = ({ label, value, labelWidth = 140 }: { label: string; value?: string; labelWidth?: number }) => (
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
            <span className="print-line" style={{
                borderBottom: '1px solid #cbd5e1', flex: 1, minWidth: 0,
                paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                fontWeight: 500, fontSize: 11, wordBreak: 'break-word',
                display: 'inline-block', lineHeight: '1.4',
            }}>
                {value || '\u00A0'}
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
            marginTop: -2, marginBottom: 7,
        }}>
            {children}
        </h3>
    );

    const CheckBox = ({ checked }: { checked: boolean }) => (
        <span style={{
            display: 'inline-block', width: 10, height: 10,
            border: '1.2px solid #475569', flexShrink: 0,
            backgroundColor: 'transparent',
            position: 'relative', verticalAlign: 'middle',
        }}>
            {checked && (
                <span style={{ position: 'absolute', top: -3, left: 1, fontSize: 10, color: '#0f172a', fontWeight: 900 }}>✓</span>
            )}
        </span>
    );

    const CheckOption = ({ label, checked }: { label: string; checked: boolean }) => (
        checked ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckBox checked={true} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{label}</span>
            </span>
        ) : null
    );
    
    // We attempt to extract nested candidate name if available
    const candidateName = data.candidateId?.name || data.candidateId?.firstName ? `${data.candidateId.firstName} ${data.candidateId.lastName || ''}`.trim() : data.candidateName || '';
    const departmentName = data.departmentId?.name || data.department || '';

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white">

            {/* Screen Header */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2 px-6">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight">SELECTION APPROVAL NOTE</h1>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between no-print mb-4 px-6">
                <button onClick={() => window.close()} className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" /> CLOSE
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0d3c68] text-white px-3 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all">
                    <Printer className="h-3.5 w-3.5" /> PRINT SELECTION NOTE
                </button>
            </div>

            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto print:w-[200mm] print:max-w-[200mm] print:mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-0">
                <div className='print:p-[8mm]'>

                    <PrintHiringHeader
                        title="SELECTION APPROVAL NOTE"
                        subtitle="(Filled by Recruitment Division)"
                        step={3}
                    />

                    <div className="print-page" style={{ position: "relative" }}>

                        {/* ── 1. Candidate Details ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>1. Candidate Details</SectionTitle>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                <InlineField label="Name of Candidate" labelWidth={140} value={candidateName} />
                                <InlineField label="Department" labelWidth={140} value={departmentName} />

                                <InlineField label="Position Selected For" labelWidth={140} value={data.jobRole || data.positionSelectedFor} />
                                <InlineField label="Work Location" labelWidth={140} value={data.workLocation} />

                                <InlineField label="Date of Joining" labelWidth={140} value={formatDate(data.dateOfJoining)} />
                                <InlineField label="Reporting To" labelWidth={140} value={data.reportingTo} />
                            </div>
                        </section>

                        <Divider />

                        {/* ── 2. Recruitment Summary ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>2. Recruitment Summary</SectionTitle>

                            {/* Row 1: Source of Hiring | Date of Interview */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: 6 }}>
                                {/* Source of Hiring — numbered */}
                                <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                    <span style={{ flexShrink: 0, width: 140 }}>Source of Hiring</span>
                                    <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                    <span className="print-line" style={{
                                        borderBottom: '1px solid #cbd5e1', flex: 1, minWidth: 0,
                                        paddingBottom: 1, paddingLeft: 4,
                                        fontWeight: 500, fontSize: 11,
                                        display: 'inline-flex', alignItems: 'center', gap: 4, lineHeight: '1.4',
                                    }}>
                                        {data.sourceOfHiring || data.recruitmentSource ? (
                                            <>
                                                <CheckBox checked={true} />
                                                <span style={{ fontWeight: 700 }}>
                                                    {(data.sourceOfHiring === 'Others' && data.sourceOthers)
                                                        ? `Others: ${data.sourceOthers}`
                                                        : (data.sourceOfHiring || data.recruitmentSource)}
                                                </span>
                                            </>
                                        ) : '\u00A0'}
                                    </span>
                                </div>

                                {/* Date of Interview */}
                                <InlineField label="Date of Interview" labelWidth={140} value={formatDate(data.dateOfInterview)} />
                            </div>

                            {/* Row 2: Interviewed By | Evaluation Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                <InlineField label="Interviewed By" labelWidth={140} value={data.interviewedBy} />

                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                    <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 140 }}>Evaluation Summary</span>
                                    <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                        {['Selected', 'Hold', 'Rejected']
                                            .filter(s => data.evaluationSummary === s)
                                            .map(s => (
                                                <CheckOption key={s} label={s} checked={true} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* ── 3. CTC Recommendation ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>3. CTC Recommendation</SectionTitle>

                            {/* Proposed CTC */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: 6 }}>
                                <InlineField label="Proposed Monthly CTC" labelWidth={140}
                                    value={data.proposedMonthlyCTC ? `₹ ${data.proposedMonthlyCTC}` : '₹\u00A0'} />
                                <InlineField
                                    label="Proposed Annual CTC"
                                    labelWidth={140}
                                    value={data.proposedAnnualCTC ? `₹ ${data.proposedAnnualCTC}` : '₹\u00A0'}
                                />
                            </div>

                            {/* Salary Structure */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                    <span style={{ flexShrink: 0, width: 140 }}>Salary Structure</span>
                                    <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                    {data.salaryStructure === 'As per company slab' && <CheckOption label="As per company slab" checked={true} />}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {data.salaryStructure === 'Exception Approved' && <CheckOption label="Exception Approved" checked={true} />}
                                </div>
                            </div>

                            {/* Budget Availability */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>

                                    <span style={{ flexShrink: 0, width: 140 }}>Budget Availability</span>
                                    <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                    {data.budgetAvailability === 'Within Budget' && <CheckOption label="Within Budget" checked={true} />}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {data.budgetAvailability === 'Budget Exceeded' && <CheckOption label="Budget Exceeded" checked={true} />}
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* ── 4. Justification for Selection ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>4. Justification for Selection</SectionTitle>
                            <p style={{
                                fontSize: 11,
                                lineHeight: '1.5',
                                color: '#0f172a',
                                fontWeight: 500,
                                margin: 0,
                                paddingLeft: 4,
                            }}>
                                {data.justification || data.justificationForVariance || data.recruitmentSummary || '\u00A0'}
                            </p>
                        </section>

                        <Divider />

                        {/* ── 5. Approvals Required ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>5. Approvals Required</SectionTitle>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 28px', alignItems: 'end' }}>
                                    <InlineField label="HR Manager" labelWidth={90} value={data.hrManagerName} />
                                    <InlineField label="Signature" labelWidth={70} value="" />
                                    <InlineField label="Date" labelWidth={40} value={formatDate(data.hrManagerSignatureDate)} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 28px', alignItems: 'end' }}>
                                    <InlineField label="Dept Head" labelWidth={90} value={data.deptHeadName} />
                                    <InlineField label="Signature" labelWidth={70} value="" />
                                    <InlineField label="Date" labelWidth={40} value={formatDate(data.deptHeadSignatureDate)} />
                                </div>
                            </div>
                        </section>

                        <Divider />

                        {/* ── 6. Final Status ── */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>6. Final Status</SectionTitle>

                            {/* Management decision */}
                            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>
                                <span style={{ flexShrink: 0, width: 90 }}>Management</span>
                                <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                {data.managementDecision ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                        <CheckBox checked={true} />
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>{data.managementDecision}</span>
                                    </span>
                                ) : (
                                    <span style={{ fontSize: 11, fontWeight: 500, color: '#64748b', fontStyle: 'italic' }}>–</span>
                                )}
                            </div>

                            {/* Name / Signature / Date */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 28px', alignItems: 'end' }}>
                                <InlineField label="Name" labelWidth={90} value={data.managementName} />
                                <InlineField label="Signature" labelWidth={70} value="" />
                                <InlineField label="Date" labelWidth={40} value={formatDate(data.managementSignatureDate)} />
                            </div>
                        </section>

                        {/* Page number */}
                        <div className="page-number-print" style={{ textAlign: 'right', fontSize: '10px', fontWeight: 600, color: '#64748b', marginTop: 8 }}>
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
                    .page-number-print {
                        position: fixed !important;
                        bottom: 6mm !important;
                        right: 7mm !important;
                        font-size: 10px !important;
                        font-weight: 600 !important;
                        color: #64748b !important;
                    }
                }
                @media screen {
                    .print-only { display: none !important; }
                    .page-number-print { text-align: right; }
                }
            `}</style>
        </div>
    );
}
