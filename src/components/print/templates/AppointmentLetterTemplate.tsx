'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function AppointmentLetterTemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchRecord();
    }, [candidateId]);

    const fetchRecord = async () => {
        try {
            setLoading(true);
            const record = await api.get('/hiring/appointment-letter', { params: { candidateId } }).then(res => res.data);
            let recordData = Array.isArray(record) ? record[0] : (record.data?.[0] || record.data || record);

            if (recordData) {
                setData(recordData);
                setTimeout(() => {
                    window.print();
                }, 500);
            } else {
                setData(null);
            }
        } catch (error: any) {
            toast.error('Failed to fetch record details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading Appointment Letter Preview...</p>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    const formattedDate = data.date
        ? new Date(data.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '___________________';

    const formattedCommencementDate = data.commencementDate
        ? new Date(data.commencementDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '___________________';

    // ── shared inline styles ──
    const body: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 500,
        color: 'rgb(15, 23, 42)',
        lineHeight: '1.5',
        textAlign: 'justify',
        margin: '0px',
    };
    const bold: React.CSSProperties = { fontWeight: 700 };
    const sectionHeading: React.CSSProperties = {
        fontSize: 12,
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: 3,
        marginTop: 6,
    };
    const HR = () => <div style={{ borderTop: '1px solid #cbd5e1', margin: '6px 0' }} />;

    const TOTAL_PAGES = 3;

    const PageWrapper = ({
        children,
        pageNumber,
        hideHeader = false,
    }: {
        children: React.ReactNode;
        pageNumber: number;
        hideHeader?: boolean;
    }) => (
        <>
            <div className="print:relative print:flex print:flex-col print:p-0 print:bg-white bg-white p-6 shadow-lg print:shadow-none mb-6 print:mb-0" style={{ minHeight: '1050px' }}>
                {hideHeader ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Step 17
                        </span>
                    </div>
                ) : (
                    <PrintHiringHeader
                        title="APPOINTMENT LETTER"
                        subtitle="(For Internal Use – HR Department)"
                        step={17}
                    />
                )}
                <div style={{ flex: 1, paddingTop: hideHeader ? 0 : 8 }}>
                    {children}
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#64748b', marginTop: 12 }}>
                    Page {pageNumber} / {TOTAL_PAGES}
                </div>
            </div>
            {pageNumber < TOTAL_PAGES && <div className="print-page-break" />}
        </>
    );

    return (
        <div className="page-container bg-slate-50 min-h-screen print:bg-white print:p-0">
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                <div>{/* ── PAGE 1 ── */}
                <PageWrapper pageNumber={1}>

                    {/* Date + Address */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                            <p style={{ ...body, marginBottom: 1 }}><span style={bold}>To,</span></p>
                            <p style={{ ...body, marginBottom: 1 }}><span style={bold}>{data.candidateName}</span></p>
                        </div>
                        <div>
                            <p style={{ ...body }}><span style={bold}>Date: {formattedDate}</span></p>
                        </div>
                    </div>

                    {/* Subject */}
                    <p style={{ ...body, ...bold, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
                        Subject: {data.subject}
                    </p>

                    <p style={body}>
                        <span style={bold}>Dear {data.dearName},</span>
                    </p>

                    <p style={body}>
                        We are pleased to appoint you to the position of <span style={bold}>{data.position}</span> at <span style={bold}>Design House India Pvt. Ltd.</span> Your selection is based on your qualifications, experience, and performance during the interview process, and we look forward to your valued contribution.
                    </p>

                    <HR />

                    {/* Section 1 */}
                    <h3 style={sectionHeading}>1. Designation &amp; Reporting</h3>
                    <p style={body}>
                        You are appointed as <span style={bold}>{data.position}</span>, reporting to the Reporting Manager or any other authority designated by the Company. You are expected to perform your duties with integrity, diligence, and professionalism, and to undertake any responsibilities assigned to you from time to time in accordance with the interests of the Company.
                    </p>

                    <HR />

                    {/* Section 2 */}
                    <h3 style={sectionHeading}>2. Commencement of Employment</h3>
                    <p style={body}>
                        Your employment shall commence on <span style={bold}>{formattedCommencementDate}</span>, and you are required to report at <span style={bold}>{data.reportingTime}</span> at the <span style={bold}>{data.reportingLocation}</span>. Any request for a change in the joining date must be made in writing to the HR Department and approved in advance.
                    </p>

                    <HR />

                    {/* Section 3 */}
                    <h3 style={sectionHeading}>3. Compensation</h3>
                    <p style={body}>
                        Your monthly Cost-to-Company (CTC) shall be <span style={bold}>₹{data.monthlyCTC}</span>, amounting to an annual CTC of <span style={bold}>₹{data.annualCTC}</span>. A detailed salary structure will be provided in the <span style={bold}>Salary Annexure</span>. Salary shall be subject to statutory deductions and applicable labour regulations.
                    </p>

                    <HR />

                    {/* Section 4 */}
                    <h3 style={sectionHeading}>4. Probation Period</h3>
                    <p style={body}>
                        You will be on probation for <span style={bold}>{data.probationPeriod}</span> from your date of joining. Your performance, conduct and suitability for the role will be reviewed during this period. Based on this evaluation, the Company may confirm your employment, extend the probation period, or discontinue your employment with immediate effect.
                    </p>

                    <HR />

                    {/* Section 5 */}
                    <h3 style={sectionHeading}>5. Working Hours</h3>
                    <p style={body}>
                        Your regular working hours shall be <span style={bold}>{data.workingHours}</span>. However, depending on operational and project requirements, you may be required to work beyond normal hours or on holidays. Such additional work shall form an essential part of your responsibilities as a managerial employee.
                    </p>

                    <HR />

                    {/* Section 6 */}
                    <h3 style={sectionHeading}>6. Location &amp; Mobility</h3>
                    <p style={body}>
                        Your initial place of posting will be the <span style={bold}>{data.reportingLocation}</span>. However, the Company reserves the right to transfer or assign you to any other location, department, client site, or project as required by operational demands.
                    </p>
                    <div style={{ ...body, ...bold, fontSize: 12, textTransform: 'uppercase', borderBottom: '1.5px solid #475569', paddingBottom: 4, marginBottom: 8 }}>
                        LEGAL &amp; COMPLIANCE SECTIONS
                    </div>

                    {/* Section 7 */}
                    <h3 style={sectionHeading}>7. Notice Period &amp; Resignation</h3>
                    <p style={body}>
                        Upon confirmation, either party may terminate the employment by giving <span style={bold}>30 days' written notice</span> or salary in lieu thereof, subject to Company approval. Resignation must be submitted in writing or via official email and shall be considered valid only upon formal acknowledgement by the HR Department.
                    </p>
                    <p style={body}>
                        During the notice period, you must complete all handover responsibilities and clearance procedures. The Company reserves the right to withhold relieving documents and final settlement until all exit formalities are satisfactorily completed.
                    </p>

                    <HR />
                    {/* Section 8 */}
                    <h3 style={sectionHeading}>8. Job Abandonment / Absconding</h3>
                    <p style={body}>
                        Absence from duty for <span style={bold}>three (3) consecutive working days</span> without prior approval or intimation shall be treated as <span style={bold}>Job Abandonment</span>. In such cases, the Company may initiate termination without notice and may withhold salary, benefits, reimbursements, experience letters, or relieving documents in accordance with Company policy and applicable law.
                    </p>

                </PageWrapper>

                {/* ── PAGE 2 ── */}
                <PageWrapper pageNumber={2} hideHeader>

                    <HR />

                    {/* Section 9 */}
                    <h3 style={sectionHeading}>9. Confidentiality, Non-Disclosure &amp; IP Protection</h3>
                    <p style={body}>
                        You will be required to sign the <span style={bold}>Confidentiality &amp; Non-Disclosure Agreement (NDA)</span> at the time of joining. Signing the NDA is mandatory and constitutes a core condition of your employment.
                    </p>
                    <p style={body}>
                        You shall maintain strict confidentiality regarding all Company information including, but not limited to, client details, business processes, financial data, operational frameworks, digital assets, and proprietary documents. This obligation shall continue even after your employment ends.
                    </p>
                    <p style={body}>
                        Any unauthorised sharing, copying, transfer or misuse of confidential or proprietary information may result in disciplinary action, financial recovery, and legal proceedings.
                    </p>
                    <p style={body}>
                        All work, documents, concepts, presentations, data, or materials created by you during your employment shall remain the exclusive intellectual property of the Company.
                    </p>

                    <HR />

                    {/* Section 10 */}
                    <h3 style={sectionHeading}>10. Company Property &amp; Digital Assets</h3>
                    <p style={body}>
                        Any Company property provided to you—such as laptops, documents, files, passwords, ID cards, digital accounts, or other equipment—must be duly safeguarded and returned in good condition upon request or at the time of separation. The Company reserves the right to recover the cost of any lost, damaged, or unreturned property.
                    </p>

                    <HR />

                    {/* Section 11 */}
                    <h3 style={sectionHeading}>11. Conduct &amp; Discipline</h3>
                    <p style={body}>
                        You are expected to uphold high standards of professional behaviour, integrity, and workplace ethics. Acts such as insubordination, harassment, misconduct, misrepresentation, data theft, breach of confidentiality, negligence or violation of Company policy may result in disciplinary action, including immediate termination.
                    </p>

                    <HR />

                    {/* Section 12 */}
                    <h3 style={sectionHeading}>12. Leave &amp; Holiday Policy</h3>
                    <p style={body}>
                        Upon successful completion of your probation, you will be eligible for leave benefits as per the Company's Leave Policy. All leave must be approved in advance by your Reporting Manager and the HR Department. Unauthorised leave may be treated as misconduct or voluntary abandonment of duty.
                    </p>
                    <p style={body}>
                        The Company will release an official Holiday List at the beginning of each calendar year. The Company reserves the right to modify or revise the leave and holiday policy from time to time.
                    </p>

                    <HR />

                    {/* Section 13 */}
                    <h3 style={sectionHeading}>13. Training &amp; Development</h3>
                    <p style={body}>
                        You may be required to undergo training or skill-development programs as deemed necessary by the Company. Participation in such programs shall form an integral part of your employment responsibilities.
                    </p>

                    <HR />

                    {/* Section 14 */}
                    <h3 style={sectionHeading}>14. Acceptance of Appointment</h3>
                    <p style={body}>
                        Please sign and return the duplicate copy of this Appointment Letter or formally confirm your acceptance via email.
                    </p>

                    <p style={body}>
                        We welcome you to <span style={bold}>Design House India Pvt. Ltd.</span> and look forward to a long, productive, and mutually rewarding association.
                    </p>

                    {/* Sign-off */}
                    <div style={{ marginTop: 6, borderTop: '1px solid #cbd5e1', paddingTop: 10 }}>
                        <p style={{ ...body, ...bold }}>Warm Regards,</p>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <p style={{ ...body, ...bold, fontSize: 12 }}>HR Department | Design House India Pvt. Ltd.</p>
                            </div>
                        </div>
                    </div>

                    {/* Employee acceptance */}
                    <div style={{ marginTop: 16, borderTop: '1.5px solid #0f172a', paddingTop: 12 }}>
                        <p style={{ ...body, ...bold, marginBottom: 10 }}>Accepted &amp; Signed By:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
                            {/* Employee Name */}
                            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 120, display: 'inline-block' }}>Employee Name</span>
                                <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                <span style={{ flex: 1, borderBottom: '1px solid #0f172a', display: 'inline-block', minWidth: 0 }}>&nbsp;</span>
                            </div>
                            {/* Date */}
                            <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
                                <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: 120, display: 'inline-block' }}>Date</span>
                                <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
                                <span style={{ flex: 1, borderBottom: '1px solid #0f172a', display: 'inline-block', minWidth: 0 }}>&nbsp;</span>
                            </div>
                        </div>
                    </div>

                </PageWrapper>

                {/* ── PAGE 3 ── */}
                <PageWrapper pageNumber={3} hideHeader>
                     {/* Empty page or additional details as required */}
                     <div className="relative print:h-[280mm] print:pt-6">
                        <div className="text-xs absolute top-4 right-1 text-gray-800 hidden print:block">Step 17</div>
                    </div>
                </PageWrapper>
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
                        font-family: 'Calibri', 'Arial', sans-serif !important;
                    }
                    html, body, #root, .page-container, main {
                        background: white !important;
                        overflow: visible !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .no-print { display: none !important; }
                    .print-page-break {
                        display: block !important;
                        page-break-before: always !important;
                        break-before: page !important;
                        height: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print\\:w-full { width: 100% !important; }
                    .print\\:max-w-full { max-width: 100% !important; }
                    .print\\:mx-auto { margin-left: auto !important; margin-right: auto !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:p-\\[8mm\\] { padding: 8mm !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:mb-0 { margin-bottom: 0 !important; }
                    .print\\:flex { display: flex !important; }
                    .print\\:flex-col { flex-direction: column !important; }
                    .print\\:relative { position: relative !important; }
                    p, span, div, li, h2, h3, h4 {
                        font-family: Poppins, Inter, -apple-system, BlinkMacSystemFont,
                            "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
