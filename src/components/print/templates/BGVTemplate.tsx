'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function BGVTemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchDetail(candidateId);
    }, [candidateId]);

    const fetchDetail = async (id: string) => {
        try {
            const candRes = await api.get(`/hiring/candidates/${id}`);
            const candidateData = candRes.data;

            const res = await api.get('/hiring/bgv', { params: { candidateId: id } });
            let recordData = Array.isArray(res.data) ? res.data[0] : (res.data.data?.[0] || res.data);

            if (recordData) {
                setData({
                    ...recordData,
                    fullName: candidateData ? `${candidateData.firstName} ${candidateData.lastName || ''}`.trim() : recordData.fullName,
                    reportCandidateName: candidateData ? `${candidateData.firstName} ${candidateData.lastName || ''}`.trim() : recordData.reportCandidateName,
                });
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to load BGV details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium">Loading BGV details...</p>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    const isRequest = data.type === 'request' || !data.verifSummary;

    const Divider = () => (
        <div style={{ borderTop: '1.5px solid #475569', margin: '10px 0 7px 0' }} className="print-divider" />
    );

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 style={{
            fontSize: 13, fontWeight: 600, color: '#0f172a',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginTop: 0, marginBottom: 7,
        }}>
            {children}
        </h3>
    );

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:h-auto print:min-h-0 print:bg-white print:py-0 print:px-0">
            {/* Printable Sheet */}
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm] print:h-auto print:min-h-0">
                <div>
                    <PrintHiringHeader
                        title={isRequest ? 'BGV REQUEST FORM' : 'BGV FINAL REPORT'}
                        subtitle={`(${isRequest ? 'Background Verification Request Form' : 'Verification Summary Report'})`}
                        step={8}
                    />

                    {isRequest ? (
                        <>
                            {/* --- PAGE 1 WRAPPER --- */}
                            <div className="relative">
                                {/* SECTION A: CANDIDATE DETAILS */}
                                <section className="mb-0">
                                    <SectionTitle>1. Candidate Details</SectionTitle>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                        <DetailField label="Full Name" value={data.fullName} />
                                        <DetailField label="Joining Date" value={formatDate(data.joiningDate)} />
                                        <DetailField label="Position For" value={data.positionFor} />
                                        <DetailField label="Home No." value={data.homeNo} />
                                        <DetailField label="Department" value={data.department} />
                                        <DetailField label="Alternate No." value={data.alternateNo} />
                                        <DetailField label="Email ID" value={data.emailId} />
                                        <DetailField label="Mobile No." value={data.mobileNo} />
                                        <DetailField label="Current Address" value={data.currentAddress} />
                                        <DetailField label="State" value={data.currentState} />
                                        <DetailField label="City & Pin Code" value={data.currentCityPin} />
                                        <DetailField label="Country" value={data.currentCountry || 'Bharat'} />
                                        <DetailField label="Permanent Address" value={data.permanentAddress} />
                                        <DetailField label="State" value={data.permanentState} />
                                        <DetailField label="City & Pin Code" value={data.permanentCityPin} />
                                        <DetailField label="Country" value={data.permanentCountry || 'Bharat'} />
                                    </div>
                                </section>

                                {/* SECTION B: DOCUMENTS */}
                                <section className="mb-0">
                                    <Divider />
                                    <SectionTitle>2. Documents Submitted for Verification <span className="text-[9px] font-normal italic" style={{ textTransform: 'none' }}>(Please tick ✓ (HR to complete))</span></SectionTitle>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px 40px' }}>
                                        {data.docs?.aadhaarCard && <CheckboxField label="Aadhaar Card" checked={true} />}
                                        {data.docs?.panCard && <CheckboxField label="PAN Card" checked={true} />}
                                        {data.docs?.marksheet10 && <CheckboxField label="10th Marksheet" checked={true} />}
                                        {data.docs?.marksheet12 && <CheckboxField label="12th Marksheet" checked={true} />}
                                        {data.docs?.graduationCert && <CheckboxField label="Graduation Certificate" checked={true} />}
                                        {data.docs?.pgCert && <CheckboxField label="Post Graduate Certificate" checked={true} />}
                                        {data.docs?.expCerts && <CheckboxField label="Experience Certificates" checked={true} />}
                                        {data.docs?.relievingLetter && <CheckboxField label="Relieving Letter" checked={true} />}
                                        {data.docs?.prevApptLetters && <CheckboxField label="Prev Appointment Letters" checked={true} />}
                                        {data.docs?.salarySlips3Months && <CheckboxField label="Last 3 Months Salary Slips" checked={true} />}
                                        {data.docs?.bankStatements3Months && <CheckboxField label="Last 3 Months Bank Statements" checked={true} />}
                                        {data.docs?.policeVerif && <CheckboxField label="Police Verification (if applicable)" checked={true} />}
                                    </div>
                                </section>

                                {/* SECTION C: REFERENCE CHECK DETAILS */}
                                <section className="mb-0">
                                    <Divider />
                                    <SectionTitle>3. Reference Check Details <span className="text-[9px] font-normal italic" style={{ textTransform: 'none' }}>(To be completed by HR before final onboarding)</span></SectionTitle>
                                    <div className="space-y-1 px-1">
                                        <div>
                                            <h4 className="text-[11px] font-bold text-slate-800 uppercase mb-2">1. Reference 1 – Professional Reference</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                                <DetailField label="Name" value={data.ref1?.name} />
                                                <DetailField label="Designation" value={data.ref1?.designation} />
                                                <DetailField label="Duration Known" value={data.ref1?.durationKnown} />
                                                <DetailField label="Relationship" value={data.ref1?.relationship} />
                                                <DetailField label="Organization" value={data.ref1?.organization} />
                                                <DetailField label="Mobile Number" value={data.ref1?.mobileNo} />
                                                <DetailField label="Email ID" value={data.ref1?.emailId} fullWidth />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-bold text-slate-800 uppercase mb-2">2. Reference 2 – Professional</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                                <DetailField label="Name" value={data.ref2?.name} />
                                                <DetailField label="Designation" value={data.ref2?.designation} />
                                                <DetailField label="Duration Known" value={data.ref2?.durationKnown} />
                                                <DetailField label="Relationship" value={data.ref2?.relationship} />
                                                <DetailField label="Organization" value={data.ref2?.organization} />
                                                <DetailField label="Mobile Number" value={data.ref2?.mobileNo} />
                                                <DetailField label="Email ID" value={data.ref2?.emailId} fullWidth />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* SECTION D: TYPE OF BGV */}
                                <section className="mb-0">
                                    <Divider />
                                    <SectionTitle>4. Type of BGV Required</SectionTitle>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px 40px' }}>
                                        {data.bgvType?.idVerification && <CheckboxField label="ID Verification" checked={true} />}
                                        {data.bgvType?.addressVerification && <CheckboxField label="Address Verification" checked={true} />}
                                        {data.bgvType?.completePackage && <CheckboxField label="Complete BGV Package" checked={true} />}
                                        {data.bgvType?.employmentVerification && <CheckboxField label="Employment Verification" checked={true} />}
                                        {data.bgvType?.policeVerification && <CheckboxField label="Police Verification" checked={true} />}
                                        {data.bgvType?.educationVerification && <CheckboxField label="Education Verification" checked={true} />}
                                        {data.bgvType?.referenceCheck && <CheckboxField label="Reference Check" checked={true} />}
                                    </div>
                                </section>

                                {/* Page 1 number */}
                                <div className="text-right text-[10px] text-[#64748b] font-bold mt-8 hidden print:block">
                                    Page 1 / 2
                                </div>
                            </div>

                            {/* --- PAGE 2 WRAPPER --- */}
                            <div className="relative" style={{ breakBefore: 'page', pageBreakBefore: 'always' }}>
                                {/* Step 8 badge */}
                                <div className='text-[10px] font-bold text-[#64748b] tracking-[0.04em] uppercase text-right mb-6 hidden print:block'>
                                    Step 8
                                </div>

                                {/* SECTION E: HR CONFIRMATION */}
                                <section className="mb-0">
                                    <Divider />
                                    <SectionTitle>5. HR Confirmation <span className="text-[9px] font-normal italic" style={{ textTransform: 'none' }}>(To be completed by HR before final onboarding)</span></SectionTitle>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: '8px' }}>
                                        <DetailField label="Requested By" value={typeof data.requestedBy === 'object' && data.requestedBy !== null ? `${data.requestedBy.firstName || ''} ${data.requestedBy.lastName || ''}`.trim() : data.requestedBy} />
                                        <DetailField label="Request Date" value={formatDate(data.requestDate)} />
                                        <DetailField label="Designation" value={data.requestDesignation} />
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ flexShrink: 0, width: 140 }}>Priority Level</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                                {data.priorityLevel === 'Normal' && <CheckboxField label="Normal" checked={true} />}
                                                {data.priorityLevel === 'Urgent' && <CheckboxField label="Urgent" checked={true} />}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* SECTION F: APPROVAL SECTION */}
                                <section className="mb-0">
                                    <Divider />
                                    <SectionTitle>6. Approval Section <span className="text-[9px] font-normal italic" style={{ textTransform: 'none' }}>(To be completed by HR before final onboarding)</span></SectionTitle>
                                    <div className="px-1 pt-1">
                                        <div className="grid grid-cols-[1.5fr,2fr,2fr,1.5fr] gap-4 text-[10px] font-bold uppercase pb-2 border-b border-slate-200">
                                            <span>Role</span>
                                            <span className="text-center">Name</span>
                                            <span className="text-center">Signature</span>
                                            <span className="text-center">Date</span>
                                        </div>
                                        <div className="space-y-0.5 ">
                                            <ApprovalRow role="HR Manager" name={data.requestApprovals?.hrManager?.name} signature={data.requestApprovals?.hrManager?.signature} date={formatDate(data.requestApprovals?.hrManager?.date)} borderless />
                                            <ApprovalRow role="HOD" name={data.requestApprovals?.deptHead?.name} signature={data.requestApprovals?.deptHead?.signature} date={formatDate(data.requestApprovals?.deptHead?.date)} borderless />
                                            <ApprovalRow role="Director" name={data.requestApprovals?.director?.name} signature={data.requestApprovals?.director?.signature} date={formatDate(data.requestApprovals?.director?.date)} borderless />
                                        </div>
                                    </div>
                                </section>

                                {/* Page 2 number */}
                                <div className="text-right text-[10px] text-[#64748b] font-bold mt-8 hidden print:block">
                                    Page 2 / 2
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ── FINAL REPORT LAYOUT ── */
                        <>
                            {/* ── SECTION 1: CANDIDATE SUMMARY ── */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>1. Candidate Summary</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <DetailField label="Candidate Name" value={data.reportCandidateName} labelWidth={160} />
                                    <DetailField label="Position" value={data.reportPosition} labelWidth={100} />
                                    <DetailField label="Employee Code" value={data.reportEmpCode} labelWidth={160} />
                                    <DetailField label="Department" value={data.reportDepartment} labelWidth={100} />
                                    <DetailField label="Date of Joining" value={formatDate(data.reportDOJ)} labelWidth={160} />
                                </div>
                            </section>

                            {/* ── SECTION 2: VERIFICATION RESULTS ── */}
                            <section style={{ marginBottom: 8 }}>
                                <Divider />
                                <SectionTitle>2. Verification Results</SectionTitle>

                                {/* 1. ID Verification */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>ID Verification</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 160 }}>Status</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                                {data.verifResults?.id?.verified && <CheckboxField label="Verified" checked={true} />}
                                                {data.verifResults?.id?.discrepancy && <CheckboxField label="Discrepancy Found" checked={true} />}
                                            </div>
                                        </div>
                                        <DetailField label="Remarks" value={data.verifResults?.id?.remarks} labelWidth={100} />
                                    </div>
                                </div>

                                {/* 2. Address Verification */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Address Verification</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px', marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 160 }}>Status</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                                {data.verifResults?.address?.verified && <CheckboxField label="Verified" checked={true} />}
                                                {data.verifResults?.address?.discrepancy && <CheckboxField label="Discrepancy Found" checked={true} />}
                                            </div>
                                        </div>
                                        <DetailField label="Remarks" value={data.verifResults?.address?.remarks} labelWidth={100} />
                                    </div>
                                </div>

                                {/* 3. Education Verification */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Education Verification</h4>
                                    <table className="w-full border-collapse border border-slate-900 text-[10px]">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="border border-slate-900 p-1.5 text-left uppercase w-[30%]">Education</th>
                                                <th className="border border-slate-900 p-1.5 text-center uppercase w-[15%]">Verified</th>
                                                <th className="border border-slate-900 p-1.5 text-left uppercase">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ResultRow category="10th" status={data.verifResults?.education?.tenth?.verified} remarks={data.verifResults?.education?.tenth?.remarks} isPrintCheck />
                                            <ResultRow category="12th" status={data.verifResults?.education?.twelfth?.verified} remarks={data.verifResults?.education?.twelfth?.remarks} isPrintCheck />
                                            <ResultRow category="Graduation" status={data.verifResults?.education?.graduation?.verified} remarks={data.verifResults?.education?.graduation?.remarks} isPrintCheck />
                                            <ResultRow category="Post-Graduation" status={data.verifResults?.education?.postGrad?.verified} remarks={data.verifResults?.education?.postGrad?.remarks} isPrintCheck />
                                        </tbody>
                                    </table>
                                </div>

                                {/* 4. Employment Verification */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Employment Verification</h4>
                                    <table className="w-full border-collapse border border-slate-900 text-[10px]">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="border border-slate-900 p-1.5 text-left uppercase w-[30%]">Company</th>
                                                <th className="border border-slate-900 p-1.5 text-center uppercase w-[15%]">Verified</th>
                                                <th className="border border-slate-900 p-1.5 text-left uppercase">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ResultRow category="Previous Employer 1" status={data.verifResults?.employment?.employer1?.verified} remarks={data.verifResults?.employment?.employer1?.remarks} isPrintCheck />
                                            <ResultRow category="Previous Employer 2" status={data.verifResults?.employment?.employer2?.verified} remarks={data.verifResults?.employment?.employer2?.remarks} isPrintCheck />
                                        </tbody>
                                    </table>
                                </div>

                                {/* 5. Reference Check */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Reference Check</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                        {/* Ref 1 Outcome */}
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 160 }}>Reference 1 Outcome</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                {data.verifResults?.reference?.ref1?.outcome === 'Positive' && <CheckboxField label="Positive" checked={true} />}
                                                {data.verifResults?.reference?.ref1?.outcome === 'Neutral' && <CheckboxField label="Neutral" checked={true} />}
                                                {data.verifResults?.reference?.ref1?.outcome === 'Negative' && <CheckboxField label="Negative" checked={true} />}
                                            </div>
                                        </div>
                                        {/* Ref 2 Outcome */}
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 130 }}>Reference 2 Outcome</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                {data.verifResults?.reference?.ref2?.outcome === 'Positive' && <CheckboxField label="Positive" checked={true} />}
                                                {data.verifResults?.reference?.ref2?.outcome === 'Neutral' && <CheckboxField label="Neutral" checked={true} />}
                                                {data.verifResults?.reference?.ref2?.outcome === 'Negative' && <CheckboxField label="Negative" checked={true} />}
                                            </div>
                                        </div>
                                        {/* Ref 1 Comments */}
                                        <DetailField label="Comments" value={data.verifResults?.reference?.ref1?.comments} labelWidth={160} />
                                        {/* Ref 2 Comments */}
                                        <DetailField label="Comments" value={data.verifResults?.reference?.ref2?.comments} labelWidth={130} />
                                    </div>
                                </div>

                                {/* 6. Criminal / Police Verification */}
                                <div style={{ marginBottom: 10 }}>
                                    <h4 style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 6 }}>Criminal / Police Verification</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 160 }}>Status</span>
                                            <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                                {data.verifResults?.criminal?.clear && <CheckboxField label="Clear" checked={true} />}
                                                {data.verifResults?.criminal?.recordFound && <CheckboxField label="Record Found" checked={true} />}
                                            </div>
                                        </div>
                                        <DetailField label="Details" value={data.verifResults?.criminal?.details} labelWidth={130} />
                                    </div>
                                </div>
                            </section>

                            {/* ── SECTION 3: VERIFICATION SUMMARY ── */}
                            <section style={{ marginBottom: 8 }}>
                                <Divider />
                                <SectionTitle>3. Verification Summary</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    {/* Overall Result */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                        <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 160 }}>Overall Result</span>
                                        <span style={{ flexShrink: 0, marginRight: 8 }}>:</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', alignItems: 'center' }}>
                                            {data.verifSummary?.overallResult === 'Verified – Clear' && <CheckboxField label="Verified – Clear" checked={true} />}
                                            {data.verifSummary?.overallResult === 'Verified – Minor Observations' && <CheckboxField label="Verified – Minor Observations" checked={true} />}
                                            {data.verifSummary?.overallResult === 'Discrepancies Found' && <CheckboxField label="Discrepancies Found" checked={true} />}
                                            {data.verifSummary?.overallResult === 'Rejected – Major Issues' && <CheckboxField label="Rejected – Major Issues" checked={true} />}
                                        </div>
                                    </div>
                                    {/* HR Remark */}
                                    <DetailField label="HR Remark" value={data.verifSummary?.hrRemark} labelWidth={130} />
                                </div>
                            </section>

                            {/* ── SECTION 4: FINAL APPROVAL ── */}
                            <section style={{ marginTop: 6 }}>
                                <Divider />
                                <SectionTitle>4. Final Approval</SectionTitle>
                                <div className="px-1 pt-1">
                                    <div className="grid grid-cols-[1.5fr,2fr,2fr,1.5fr] gap-4 text-[10px] font-bold uppercase pb-1 border-b border-slate-200">
                                        <span>Role</span>
                                        <span className='text-center'>Name</span>
                                        <span className="text-center">Signature</span>
                                        <span className='text-center'>Date</span>
                                    </div>
                                    <div className="space-y-0.5 mt-1">
                                        <ApprovalRow role="HR Manager" name={data.reportApprovals?.hrManager?.name} signature={data.reportApprovals?.hrManager?.signature || data.requestApprovals?.hrManager?.signature} date={formatDate(data.reportApprovals?.hrManager?.date)} borderless />
                                        <ApprovalRow role="Director" name={data.reportApprovals?.director?.name} signature={data.reportApprovals?.director?.signature || data.requestApprovals?.director?.signature} date={formatDate(data.reportApprovals?.director?.date)} borderless />
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
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
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        html, body { 
            background: white !important; 
            background-color: white !important;
            margin: 0 !important; 
            padding: 0 !important; 
        }
        .no-print { 
            display: none !important; 
        }
        .page-container { 
            background: white !important; 
            background-color: white !important;
            padding: 0 !important; 
            margin: 0 !important; 
            min-height: 0 !important;
            height: auto !important;
            overflow: visible !important;
        }
        .print-transparent-bg {
            background: transparent !important;
            background-color: transparent !important;
        }
        .data-value {
            font-family: 'Calibri', 'Segoe UI', Arial, sans-serif !important;
            font-weight: 500 !important;
            line-height: 1.4 !important;
        }
        tr { 
            page-break-inside: avoid;
        }
        .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
        }
        p, span, h1, h2, h3, h4, h5, h6, div, td, th {
            color: #000000 !important;
        }
    }
            `}</style>
        </div>
    );
}

function DetailField({ label, value, fullWidth = false, colSpan = 1, labelWidth = 140 }: { label: string, value?: string, fullWidth?: boolean, colSpan?: number, labelWidth?: number }) {
    return (
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
            <span className="print-line" style={{
                borderBottom: '1px solid #cbd5e1', flex: 1, minWidth: 0,
                paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                fontWeight: 500, fontSize: 11, wordBreak: 'break-word',
                display: 'inline-block', lineHeight: '1.4',
            }}>{value || '\u00A0'}</span>
        </div>
    );
}

function CheckboxField({ label, checked }: { label: string, checked: boolean }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span className="print-transparent-bg" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 12, height: 12, border: '1.2px solid #0f172a',
                flexShrink: 0
            }}>
                {checked && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </span>
            {label && <span style={{ fontSize: 11, fontWeight: checked ? 700 : 500, color: '#0f172a' }}>{label}</span>}
        </div>
    );
}

function ApprovalRow({ role, name, signature, date, borderless = false }: { role: string, name?: string, signature?: string, date?: string, borderless?: boolean }) {
    if (borderless) {
        return (
            <div className="grid grid-cols-[1.5fr,2fr,2fr,1.5fr] gap-4 items-end min-h-[2.1rem] py-0.5">
                <div className="text-[11px] font-bold uppercase text-slate-900">{role}</div>
                <div className="border-b border-[#cbd5e1] px-1 italic text-[11px] data-value min-h-[18px]">{name || ''}</div>
                <div className="border-b border-[#cbd5e1] px-1 italic text-[11px] data-value min-h-[18px] text-center">{signature || ''}</div>
                <div className="border-b border-[#cbd5e1] px-1 text-[11px] data-value min-h-[18px]">{formatDate(date)}</div>
            </div>
        );
    }
    return (
        <tr>
            <td className="border border-slate-900 p-1.5 font-bold uppercase">{role}</td>
            <td className="border border-slate-900 p-1.5 italic h-[2.5rem]">{name || ''}</td>
            <td className="border border-slate-900 p-1.5 text-center text-black font-medium italic min-w-[120px]">
                {signature ? signature : <span className="text-slate-200 font-normal">________________</span>}
            </td>
            <td className="border border-slate-900 p-1.5 font-medium">{formatDate(date)}</td>
        </tr>
    );
}

function ResultRow({ category, status, remarks, isPrintCheck = false }: { category: string, status: boolean, remarks: string, isPrintCheck?: boolean }) {
    return (
        <tr>
            <td className="border border-slate-900 p-1.5 font-bold">{category}</td>
            <td className="border border-slate-900 p-1.5 text-center">
                {isPrintCheck ? (
                    <div className="flex justify-center">
                        <CheckboxField label="" checked={status} />
                    </div>
                ) : (
                    <span className="font-black">{status === true ? 'V' : (status === false ? 'X' : '-')}</span>
                )}
            </td>
            <td className="border border-slate-900 p-1.5 italic">{remarks || ''}</td>
        </tr>
    );
}
