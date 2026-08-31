'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import PrintHiringHeader from '@/components/print/PrintHiringHeader';

export default function NDATemplate({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) fetchRecord();
    }, [candidateId]);

    const fetchRecord = async () => {
        try {
            setLoading(true);
            const record = await api.get('/hiring/nda', { params: { candidateId } }).then(res => res.data);
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
            toast.error('Failed to fetch NDA details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading Agreement Preview...</p>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';

        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;

        return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const d = new Date(data.employeeDate || new Date());
    const day = d.getDate();
    const getOrdinal = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    const month = d.toLocaleString('default', { month: 'long' });
    const year = d.getFullYear();

    const body: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 500,
        color: '#0f172a',
        lineHeight: '1.5',
        textAlign: 'justify',
        marginBottom: 0,
    };

    const bold: React.CSSProperties = {
        fontWeight: 700,
    };

    const sectionHeading: React.CSSProperties = {
        fontSize: 13,
        fontWeight: 600,
        color: '#0f172a',
        marginBottom: 7,
        marginTop: -2,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    };

    const li: React.CSSProperties = {
        fontSize: 11,
        fontWeight: 500,
        color: '#0f172a',
        lineHeight: '1.5',
        marginBottom: 0,
    };

    const HR = () => <div style={{ borderTop: '1.5px solid #475569', margin: '10px 0 7px 0' }} />;

    const InlineField = ({ label, value, labelWidth = 140 }: { label: string; value?: string; labelWidth?: number; }) => (
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a' }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
            <span
                className="print-line"
                style={{
                    borderBottom: '1px solid #cbd5e1',
                    flex: 1, minWidth: 0,
                    paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                    fontWeight: 500, fontSize: 11,
                    wordBreak: 'break-word',
                    display: 'inline-block', lineHeight: '1.4',
                    textTransform: 'capitalize',
                }}
            >
                {value || '\u00A0'}
            </span>
        </div>
    );

    const PageWrapper = ({ children, pageNumber, totalPages = 7, hideHeader = false }: any) => (
        <>
            {/* print:min-h-[285mm] */}
            <div className="print:relative print:flex print:flex-col print:p-0 print:bg-white bg-white p-6 shadow-lg print:shadow-none mb-6 print:mb-0" style={{ minHeight: '1050px' }}>

                {/* On header pages step is shown inside PrintHiringHeader; on non-header pages show small badge */}
                {hideHeader && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Step 14
                        </span>
                    </div>
                )}
                {!hideHeader && (
                    <PrintHiringHeader
                        title="CONFIDENTIALITY, NON-SOLICITATION & NON-COMPETE AGREEMENT"
                        subtitle="(For Internal Use – HR Department)"
                        step={14}
                    />
                )}
                <div style={{ flex: 1, paddingTop: hideHeader ? 0 : 8 }}>
                    {children}
                </div>
                <div style={{ textAlign: 'right', fontSize: 10, fontWeight: 600, color: '#64748b', marginTop: 12 }}>
                    Page {pageNumber} / {totalPages}
                </div>
            </div>
            {pageNumber < totalPages && <div className="print-page-break" />}
        </>
    );

    return (
        <div className="page-container bg-slate-50 min-h-screen print:bg-white print:p-0">
            <div className="max-w-[900px] mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-[1.3cm]">
                {/* --- PAGE 1 --- */}
                <PageWrapper pageNumber={1}>
                    <div style={{ textAlign: 'left', }}>
                        <h3 style={sectionHeading}>
                            1. CONFIDENTIALITY, NON-SOLICITATION &amp; NON-COMPETE AGREEMENT
                        </h3>
                    </div>

                    <p style={body}>
                        <span style={bold}>THIS EMPLOYMENT AGREEMENT</span> is executed on this <span style={bold}>{getOrdinal(day)} day of {month}, {year}</span>,
                    </p>

                    <p style={{ ...body, textAlign: 'left' }}><span style={bold}>BY AND BETWEEN:</span></p>
                    <p style={{ ...body, textAlign: 'left' }}><span style={bold}>Design House India Pvt. Ltd.,</span></p>

                    <p style={body}>
                        a company incorporated under the <span style={bold}>Companies Act, 1956</span>, having its registered office at:
                        <span style={bold}> 12/52, Site II, Loni Road Industrial Area, Mohan Nagar, Ghaziabad – 201007, Uttar Pradesh, India</span>,
                        hereinafter referred to as the <span style={bold}>"Company"</span> or the <span style={bold}>"Employer"</span>,<br />
                        (which expression shall, unless repugnant to the context or meaning thereof, include its successors, legal representatives and permitted assigns)<br />
                        <span style={bold}>of the FIRST PART;</span>
                    </p>

                    <p style={{ ...body, textAlign: 'left' }}><span style={bold}>AND</span></p>
                    <p style={{ ...body, marginBottom: 3 }}>Mr. <span style={{ textDecoration: 'underline' }}>{data.candidateName || '__________________'}</span>,</p>
                    <p style={{ ...body, marginBottom: 3 }}>S/o <span style={{ textDecoration: 'underline' }}>{data.fatherName || '______________'}</span>,</p>
                    <p style={{ ...body, marginBottom: 3 }}>aged about <span style={{ textDecoration: 'underline' }}>{data.age || '__________'}</span>,</p>
                    <p style={{ ...body, marginBottom: 3 }}>resident of <span style={{ textDecoration: 'underline' }}>{data.residentOf1 ? `${data.residentOf1} ${data.residentOf2 || ''}` : '_______________________________________________'}</span></p>
                    <p style={{ ...body, marginBottom: 3 }}>
                        who has been appointed as a <span style={{ textDecoration: 'underline' }}>{data.designation || '____________________'}</span> at <span style={bold}>Mohan Nagar, Ghaziabad</span>,
                    </p>
                    <p style={{ ...body, marginBottom: 3 }}>hereinafter referred to as the <span style={bold}>"Employee"</span>,</p>
                    <p style={{ ...body, marginBottom: 3 }}>(which expression shall, unless repugnant to the context, include his heirs, legal representatives and permitted assigns)</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>of the SECOND PART.</span></p>

                    <HR />

                    <h3 style={sectionHeading}>2. RECITALS</h3>
                    <p style={body}><span style={bold}>2.1</span> The Company and the Employee have entered into an <span style={bold}>Employment Agreement</span> of even date, which sets out the terms and conditions of employment and governs the employment relationship between the Parties ("Employment Agreement").</p>
                    <p style={body}><span style={bold}>2.2</span> Under the terms of the Employment Agreement, it is a condition of employment that the Employee execute this <span style={bold}>Confidentiality, Non-Solicitation and Non-Compete Agreement</span>.</p>
                    <p style={body}><span style={bold}>2.3</span> The Company possesses and regularly uses <span style={bold}>Confidential Information</span> and trade secrets, which include, inter alia, business strategies, financial data, client and vendor information, proprietary content, training methodologies, internal systems, and processes, all of which are critical to its business and competitive advantage.</p>
                    <p style={body}><span style={bold}>2.4</span> The Company desires to protect its Confidential Information and other legitimate business interests by requiring the Employee to adhere to confidentiality, non-solicitation and limited non-compete covenants as set out in this Agreement.</p>
                    <p style={body}><span style={bold}>2.5</span> The Employee desires to establish and maintain an employment relationship with the Company and acknowledges that execution of this Agreement is a <span style={bold}>material, essential and non-negotiable condition</span> of his employment and continued engagement with the Company.</p>
                    <p style={body}><span style={bold}>2.6</span> The Employee acknowledges that the Company will invest substantial <span style={bold}>time, money, resources and effort</span> in his training, orientation, and development, and that he will be provided access to confidential and commercially sensitive information, trade secrets and relationships belonging exclusively to the Company.</p>
                    <p style={body}><span style={bold}>2.7</span> The Employee acknowledges and agrees that the Company's commitments under the Employment Agreement—including but not limited to <span style={bold}>base salary, allowances, benefits, training, professional development opportunities, and access to Company resources—constitute adequate and sufficient consideration</span> for the covenants contained in this Agreement.</p>
                    <p style={body}>NOW, THEREFORE, in consideration of the mutual covenants, promises and undertakings contained herein and in the Employment Agreement, the Parties agree as follows:</p>

                    <HR />

                    <h3 style={sectionHeading}>3. TERM OF THIS AGREEMENT</h3>
                    <p style={body}><span style={bold}>3.1</span> This Agreement shall commence on the date first written above and shall remain in full force and effect <span style={bold}>throughout the period of employment</span> of the Employee with the Company.</p>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>3.2</span> The following obligations shall <span style={bold}>survive termination</span> of employment to the extent specified below:</p>
                </PageWrapper>

                {/* --- PAGE 2 --- */}
                <PageWrapper pageNumber={2} hideHeader>
                    <ul style={{ marginLeft: 24, marginBottom: 10 }}>
                        <li style={li}>Confidentiality obligations – for a period of <span style={bold}>three (3) years</span> from the date of termination;</li>
                        <li style={li}>Non-solicitation obligations – for a period of <span style={bold}>twelve (12) months</span> from the date of termination;</li>
                        <li style={li}>Non-compete obligations – for a period of <span style={bold}>six (6) months</span>, but only to the extent permitted under Indian law and only to protect the Company's Confidential Information and trade secrets;</li>
                        <li style={li}>Intellectual Property / Work Product ownership – <span style={bold}>permanently</span>, without any time limit.</li>
                    </ul>
                    <p style={body}><span style={bold}>3.3</span> Nothing in this Agreement shall be construed as guaranteeing employment for any fixed term. Termination of employment shall be governed by the <span style={bold}>Employment Agreement</span> and applicable law; however, termination shall <span style={bold}>not release</span> the Employee from obligations that survive under this Agreement.</p>
                    <HR />
                    <h3 style={sectionHeading}>4. DEFINITIONS</h3>
                    <p style={body}>For purposes of this Agreement, the following terms shall have the meanings set forth below:</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.1 "Confidential Information"</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>"Confidential Information" means all information, data, knowledge, and material, whether oral, written, electronic, digital, or otherwise, relating to the business of the Company, including but not limited to:</p>
                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>a) Business &amp; Commercial Information</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 4 }}>
                        <li style={li}>Customer lists, key accounts, contact details, order history;</li>
                        <li style={li}>Proposals, quotations, pricing structures, and commercial terms;</li>
                        <li style={li}>Sales funnels, conversion strategies, pipelines, and forecasts;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>b) Marketing &amp; Strategic Information</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Marketing plans, campaign strategies, advertising concepts;</li>
                        <li style={li}>Brand strategy, positioning, growth, and expansion plans;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>c) Financial &amp; Operational Information</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Budgets, costings, profit &amp; loss, projections, and MIS reports;</li>
                        <li style={li}>Vendor pricing, internal rate sheets, margin data;</li>
                        <li style={li}>Internal operational processes, SOPs, manuals, and checklists;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>d) Human Resource &amp; Internal Data</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Employee lists, roles, salary data, performance appraisals;</li>
                        <li style={li}>Disciplinary records, HR policies, and procedures;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>e) Technical, Creative &amp; Digital Assets</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Software tools, CRM data, configuration, internal platforms;</li>
                        <li style={li}>Login credentials, passwords, authentication details, internal URLs;</li>
                        <li style={li}>Presentations, graphics, videos, photographs, creative layouts;</li>
                        <li style={li}>Training materials, course content, handbooks, templates, scripts, designs;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>f) Third-Party Information</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Any information received by the Company from clients, vendors, partners or third parties which is subject to confidentiality obligations;</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 2 }}><span style={{ ...bold, textDecoration: 'underline' }}>g) Derived Works</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>All summaries, notes, analyses, compilations, studies, or other documents prepared by the Employee or any third party derived from or based on the foregoing.</li>
                    </ul>

                    <p style={body}>Confidential Information includes <span style={bold}>all forms and formats</span>, whether written, verbal, visual, electronic, digital, or stored in any medium.</p>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.2 Exclusions</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>Information shall not be considered Confidential Information if the Employee can demonstrate with written evidence that:</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>a)</span> It was in the Employee's lawful possession before disclosure by the Company; or</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>b)</span> It entered the public domain without fault or breach by the Employee; or</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>c)</span> It was lawfully received from a third party without any obligation of confidentiality; or</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>d)</span> It was independently developed by the Employee after termination, without reference to or use of the Company's Confidential Information; or</p>
                    <p style={body}><span style={bold}>e)</span> Disclosure is required by applicable law, a court of competent jurisdiction or a governmental authority, provided that (to the extent legally permissible) the Employee gives <span style={bold}>prior written notice</span> to the Company and limits disclosure to the minimum level legally required.</p>
                </PageWrapper>

                {/* --- PAGE 3 --- */}
                <PageWrapper pageNumber={3} hideHeader>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.3 "Customer"</span></p>
                    <p style={body}>"Customer" means any person or entity which has purchased or ordered products or services from the Company, or entered any contract with the Company for products or services, within the <span style={bold}>twelve (12) months</span> immediately preceding the termination of the Employee's employment.</p>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.4 "Prospective Customer"</span></p>
                    <p style={body}>"Prospective Customer" means any person or entity which has, within twelve (12) months prior to termination, engaged in meaningful communication with the Company regarding potential purchase of products or services (including enquiries, proposals, negotiations, or scheduled meetings).</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.5 "Restricted Area"</span></p>
                    <p style={{ ...body, marginBottom: 4 }}>"Restricted Area" means any geographical area within a <span style={bold}>2 (two) kilometre radius</span> of any office, branch, clinic, outlet, facility, project site, or other commercial premises operated by the Company at the time of termination of the Employee's employment.</p>
                    <p style={body}>If any court of competent jurisdiction finds the Restricted Area unreasonable, it shall be <span style={bold}>reduced to such area as the court deems reasonable and enforceable</span> considering Indian law and public policy.</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.6 "Directly or Indirectly"</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>"Directly or indirectly" includes actions taken:</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>by the Employee personally; or</li>
                        <li style={li}>through any partnership, company, firm, association; or</li>
                        <li style={li}>as a director, officer, consultant, advisor, employee, representative or agent of another entity; or</li>
                        <li style={li}>as a significant shareholder (holding 5% or more of voting rights) in any competing entity.</li>
                    </ul>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>4.7 "Restrictive Period"</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>"Restrictive Period" means:</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>for non-solicitation obligations: <span style={bold}>12 (twelve) months</span> post-termination;</li>
                        <li style={li}>for non-competition obligations: <span style={bold}>6 (six) months</span> post-termination;</li>
                    </ul>
                    <p style={body}>subject always to Indian law and judicial interpretation.</p>

                    <HR />
                    <h3 style={sectionHeading}>5. DUTY OF CONFIDENTIALITY</h3>
                    <p style={body}><span style={bold}>5.1</span> The Employee acknowledges that Confidential Information is a valuable business asset and a legitimate protectable interest of the Company.</p>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>5.2</span> The Employee agrees that during employment and for the period specified under Clause 3.2:</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>a)</span> He shall <span style={bold}>maintain strict confidentiality</span> and shall not disclose any Confidential Information to any person or entity except as authorised in writing by the Company;</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>b)</span> He shall use Confidential Information <span style={bold}>only for the purpose of performing his duties</span> as an employee of the Company and for no other purpose;</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>c)</span> He shall not make any unauthorised copies, downloads, or transfers of Confidential Information;</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>d)</span> He shall comply with all <span style={bold}>IT security, data protection, and document handling policies</span> of the Company;</p>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>e)</span> He shall not discuss Confidential Information in public places, social gatherings or on social media;</p>
                    <p style={body}><span style={bold}>f)</span> He shall not use Confidential Information for personal gain or for the benefit of any third party, whether during or after his employment.</p>
                    <p style={body}><span style={bold}>5.3</span> If the Employee becomes aware of any unauthorised access, disclosure, or potential breach of Confidential Information, he shall <span style={bold}>immediately notify the Company in writing</span> and cooperate with the Company in investigating and mitigating such breach.</p>

                    <HR />

                    <h3 style={sectionHeading}>6. LIMITED DISCLOSURE WHEN REQUIRED BY LAW</h3>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>6.1</span> If the Employee is compelled by law, court order, or regulatory authority to disclose Confidential Information, he shall (to the extent legally permissible):</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Promptly notify the Company in writing about the requirement;</li>
                        <li style={li}>Allow the Company reasonable opportunity to seek a protective order or other remedy;</li>
                        <li style={li}>Disclose only such portion of Confidential Information as is strictly required by law.</li>
                    </ul>
                </PageWrapper>

                {/* --- PAGE 4 --- */}

                <PageWrapper pageNumber={4} hideHeader>
                    <h3 style={sectionHeading}>7. RETURN OF COMPANY PROPERTY &amp; DESTRUCTION OF MATERIAL</h3>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>7.1</span> Upon termination of employment, or earlier upon request of the Company, the Employee shall:</p>
                    <p style={{ ...body, marginBottom: 4 }}>a) Return to the Company all property in his possession including laptop(s), access cards, ID cards, devices, documents, files, samples, prototypes, and any other material belonging to the Company;</p>
                    <p style={{ ...body, marginBottom: 4 }}>b) Return or hand over all external storage devices containing Company data;</p>
                    <p style={{ ...body, marginBottom: 4 }}>c) Permanently delete all Company data and Confidential Information from personal devices, email accounts, and cloud storage;</p>
                    <p style={body}>d) Provide a written declaration, if so requested, confirming that no copies (digital or physical) of Confidential Information are retained.</p>
                    <p style={body}><span style={bold}>7.2</span> Any retention of Confidential Information or Company property after termination may constitute <span style={bold}>misconduct, breach of contract and may amount to criminal breach of trust or data theft</span> under Indian law, entitling the Company to civil and criminal remedies.</p>
                    <HR />

                    <h3 style={sectionHeading}>8. NON-CIRCUMVENTION</h3>
                    <p style={body}><span style={bold}>8.1</span> The Employee shall not, during employment or thereafter, <span style={bold}>circumvent the Company</span> by using Confidential Information to pursue business opportunities, deals or transactions for his own benefit or for the benefit of any third party, except through and with the knowledge of the Company.</p>
                    <p style={body}><span style={bold}>8.2</span> After termination, any business inquiry or opportunity arising primarily out of Confidential Information or relationships formed on behalf of the Company shall be <span style={bold}>redirected to the Company</span>.</p>
                    <HR />
                    <h3 style={sectionHeading}>9. WORK PRODUCT &amp; INTELLECTUAL PROPERTY</h3>
                    <p style={body}><span style={bold}>9.1</span> All work, materials, inventions, designs, concepts, strategies, documents, presentations, scripts, graphs, reports, training modules, creative content, and any other output created or developed by the Employee <span style={bold}>in the course of employment</span> ("Work Product") shall be deemed <span style={bold}>"work made for hire"</span> and shall be the sole and exclusive property of the Company.</p>
                    <p style={body}><span style={bold}>9.2</span> To the extent any Work Product does not qualify as a work made for hire, the Employee hereby irrevocably assigns to the Company <span style={bold}>all right, title and interest</span> in such Work Product, including all present and future intellectual property rights therein, for the full term of such rights.</p>
                    <p style={body}><span style={bold}>9.3</span> The Employee agrees to execute all documents and perform such acts, at the Company's cost, as may be reasonably necessary to register, protect, or enforce the Company's rights in such Work Product in India or any other jurisdiction.</p>
                    <p style={body}><span style={bold}>9.4</span> Work or inventions developed purely in the Employee's personal time, without using Company resources and not related to the Company's business, shall remain the Employee's property.</p>
                    <HR />

                    <h3 style={sectionHeading}>10. NON-SOLICITATION</h3>
                    <p style={{ ...body, marginBottom: 8 }}>During employment and for <span style={bold}>twelve (12) months</span> following termination, the Employee shall not, directly or indirectly:</p>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>10.1 Customers &amp; Prospective Customers</span></p>
                    <ul style={{ marginLeft: 24, marginBottom: 10 }}>
                        <li style={li}>Solicit, induce, or attempt to solicit or induce any Customer or Prospective Customer to cease or reduce business with the Company;</li>
                        <li style={li}>Encourage any Customer or Prospective Customer to shift or divert orders to a competitor or to the Employee personally;</li>
                        <li style={li}>Provide competing services or products to any Customer or Prospective Customer in the Restricted Area, whether on his own or through another entity.</li>
                    </ul>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>10.2 Employees &amp; Associates</span></p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>Induce, recruit, or encourage any employee, consultant, freelancer, advisor, agent, or representative of the Company to resign, terminate, or reduce their association with the Company;</li>
                        <li style={li}>Assist any third party in hiring or soliciting the Company's employees or key associates.</li>
                    </ul>
                    <p style={body}>This Clause shall be interpreted and enforced in line with Section 27 of the Indian Contract Act, 1872 and prevailing Indian case law on restraint of trade.</p>
                    <HR />
                    <h3 style={sectionHeading}>11. NON-COMPETE (LIMITED, INDIA-COMPLIANT)</h3>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>11.1</span> The Employee agrees that, for a period of <span style={bold}>six (6) months</span> following termination, he shall not, within the Restricted Area, directly or indirectly:</p>
                </PageWrapper>

                {/* --- PAGE 5 --- */}
                <PageWrapper pageNumber={5} hideHeader>
                    <p style={{ ...body, marginBottom: 4 }}>a) Use Company's Confidential Information or trade secrets to engage in, manage, operate, or assist a business that competes with the principal business of the Company;</p>

                    <p style={{ ...body, marginBottom: 4 }}>b) Join, consult for, or provide services to a competitor in a role substantially like his role with the Company <span style={bold}>where such role would reasonably involve the use of Confidential Information</span>;</p>
                    <p style={body}>c) Start or assist a business which primarily targets the Company's Customers or Prospective Customers using knowledge and data gained from the Company.</p>


                    <HR />

                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>11.2</span> The Parties expressly agree and understand that:</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>This non-compete clause is <span style={bold}>narrowly tailored</span> to protect Confidential Information and trade secrets;</li>
                        <li style={li}>It is not intended, and shall not be interpreted, to absolutely prevent the Employee from earning a livelihood or working in general;</li>
                        <li style={li}>To the extent any part of this Clause is held unenforceable by a court, such part shall be <span style={bold}>severed or suitably modified</span>, and the remaining part shall continue to be enforceable.</li>
                    </ul>

                    <HR />

                    <h3 style={sectionHeading}>12. NON-DISPARAGEMENT</h3>
                    <p style={body}><span style={bold}>12.1</span> The Employee shall not make or publish, whether orally or in writing or through social media, any false, malicious, or defamatory statements about the Company, its management, employees, products, services, or clients, except where required by law or legal process.</p>

                    <HR />
                    <h3 style={sectionHeading}>13. ACKNOWLEDGEMENTS</h3>
                    <p style={{ ...body, marginBottom: 6 }}>The Employee acknowledges that:</p>
                    <p style={body}><span style={bold}>13.1</span> The restrictions contained in this Agreement are <span style={bold}>reasonable</span> in scope, duration, and geography, and are necessary to protect the Company's Confidential Information and legitimate business interests.</p>
                    <p style={body}><span style={bold}>13.2</span> Any breach of this Agreement would cause <span style={bold}>serious and irreparable harm</span> to the Company, for which monetary damages alone may not be an adequate remedy.</p>
                    <p style={body}><span style={bold}>13.3</span> The Company shall be entitled to seek <span style={bold}>injunctive relief</span> (temporary or permanent) in addition to damages, costs and other reliefs as may be available under law.</p>
                    <p style={body}><span style={bold}>13.4</span> Any failure by the Company to enforce any provision at any time shall <span style={bold}>not</span> be construed as a waiver of its right to enforce the same or any other provision later.</p>


                    <HR />

                    <h3 style={sectionHeading}>14. REPRESENTATIONS AS TO PRIOR AGREEMENTS</h3>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>14.1</span> The Employee represents and warrants that:</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>He is not bound by any non-competition, non-solicitation or confidentiality agreement with any previous employer that would prevent him from lawfully working with the Company;</li>
                        <li style={li}>He will not disclose any confidential information of his previous employer to the Company;</li>
                        <li style={li}>He will indemnify and keep the Company indemnified from any claims arising out of breach of obligations owed to his previous employer.</li>
                    </ul>

                    <HR />

                    <h3 style={sectionHeading}>15. USE OF EMPLOYEE NAME, IMAGE &amp; VOICE</h3>
                    <p style={body}><span style={bold}>15.1</span> The Employee expressly agrees and authorises that the Company may, without requiring any further written consent, use, publish or display the Employee's name, photograph, image, likeness, voice, audio or video recordings, or any representation thereof, for any bona fide business purpose of the Company.</p>
                    <p style={{ ...body, marginBottom: 6 }}><span style={bold}>15.2</span> Such usage may include, without limitation:</p>
                    <ul style={{ marginLeft: 18, marginBottom: 6 }}>
                        <li style={li}>internal and external corporate communication;</li>
                        <li style={li}>website, brochures, marketing, and promotional materials;</li>
                        <li style={li}>training materials, presentations, and educational content;</li>
                        <li style={li}>social media, digital media, or official Company announcements;</li>
                        <li style={li}>internal HR records, ID systems, or organisational charts.</li>
                    </ul>
                    <p style={body}><span style={bold}>15.3</span> The Employee expressly waives any claim to compensation, royalties, approval rights or further permissions relating to such usage, provided the Company does not misrepresent or portray the Employee in a defamatory manner.</p>
                    <HR />

                    <h3 style={sectionHeading}>16. TERMINATION &amp; CONSEQUENCES OF TERMINATION</h3>
                </PageWrapper>

                {/* --- PAGE 6 --- */}
                <PageWrapper pageNumber={6} hideHeader>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>16.1 Limitation to Raise Claims</span></p>
                    <p style={{ ...body, marginBottom: 4 }}>The Employee agrees that any claim, dispute or cause of action relating to employment, this Agreement or any Company action must be raised within <span style={bold}>300 days</span> from the date the Employee knew, or reasonably should have known, of the facts giving rise to such claim.</p>
                    <p style={body}>The Employee waives any longer limitation period, to the extent permitted under Indian law.</p>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>16.2 Liquidated Damages for Premature Exit or Breach</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>If the Employee:</p>
                    <p style={{ ...body, marginBottom: 4 }}>a) resigns or abandons employment before completing the minimum contractual period, or</p>
                    <p style={{ ...body, marginBottom: 4 }}>b) commits misconduct, violation, breach, or acts/omissions forcing the Company to terminate employment, or</p>
                    <p style={{ ...body, marginBottom: 6 }}>c) breaches obligations under this Agreement or the Employment Agreement,</p>
                    <p style={body}>then the Employee shall be liable to pay the Company <span style={bold}>liquidated damages equivalent to three (3) months of the Employee's last drawn gross salary</span>.</p>
                    <p style={{ ...body, marginBottom: 6 }}>The Employee agrees and acknowledges that:</p>
                    <ul style={{ marginLeft: 24, marginBottom: 10 }}>
                        <li style={li}>these liquidated damages are a genuine pre-estimate of loss;</li>
                        <li style={li}>the Company is not required to prove actual damage in court;</li>
                        <li style={li}>the amount is independent of other remedies available to the Company;</li>
                        <li style={li}>the Company has a <span style={bold}>first lien</span> over any dues payable to the Employee;</li>
                        <li style={li}>the Company may set off such dues against damages without further notice.</li>
                    </ul>
                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>16.3 Grounds for Immediate Termination Without Notice or Compensation</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>The Employee may be terminated with immediate effect, without notice or compensation, during probation or after confirmation, if:</p>
                    <ol style={{ marginLeft: 18, marginBottom: 6 }}>
                        {[
                            { title: 'Medical Unfitness', text: 'The Employee is declared medically unfit to perform duties.' },
                            { title: 'Criminal Conduct or Misrepresentation', text: 'The Employee is convicted by any court, or it is discovered that he: concealed past criminal records, furnished false details regarding age, qualification, experience, or salary, provided misleading documents at hiring.' },
                            { title: 'Unauthorised Absence', text: "Employee's absence is unapproved, prolonged, or causes operational hardship." },
                            { title: 'Misconduct / Indiscipline / Violation of Policies', text: 'The Employee engages in: dishonesty, insubordination, or misconduct; wilful or habitual negligence; violation of lawful orders, instructions, or policies; breach of confidentiality, data protection, or trust.' },
                            { title: 'Financial Impropriety', text: 'The Employee accepts or attempts to accept: illegal monetary benefit, kickbacks, bribes, favours; unauthorised rewards from clients, vendors, or any associated entity.' },
                            { title: 'Other Valid Grounds', text: 'Any other reason which, in the reasonable opinion of the Company, constitutes sufficient ground to terminate employment to protect Company interest, operations, safety or reputation.' },
                        ].map((item, i) => (
                            <li key={i} style={{ ...li, marginBottom: 8 }}>
                                <span style={bold}>{item.title}</span><br />
                                {item.text}
                            </li>
                        ))}
                    </ol>

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>16.4 Obligations Upon Termination</span></p>
                    <p style={{ ...body, marginBottom: 6 }}>Upon termination for any reason, the Employee must immediately:</p>
                    {['return all Company property (laptop, devices, files, access cards, documents);',
                        'surrender all Confidential Information;',
                        'permanently delete all Company data from personal devices and storage;',
                        'cease using all Company credentials or access rights;',
                        'comply with all surviving obligations including confidentiality, non-solicitation, non-compete, IP rights and non-disparagement.'
                    ].map((t, i) => (
                        <p key={i} style={{ ...body, marginBottom: 4 }}>• {t}</p>
                    ))}

                    <p style={{ ...body, marginBottom: 4 }}><span style={bold}>16.5 No Waiver of Company's Rights</span></p>
                    <p style={{ ...body, marginBottom: 4 }}>Any delay, inaction or failure by the Company to exercise its right to terminate, to enforce any clause, or to act upon misconduct shall <span style={bold}>not</span> be construed as a waiver.</p>
                    <p style={body}>The Company may enforce its rights at any time.</p>
                </PageWrapper>

                {/* --- PAGE 7 --- */}
                <PageWrapper pageNumber={7} totalPages={7} hideHeader>
                    <HR />
                    <h3 style={sectionHeading}>17. GOVERNING LAW &amp; JURISDICTION</h3>

                    <p style={body}><span style={bold}>17.1</span> This Agreement shall be governed by and construed in accordance with the <span style={bold}>laws of India</span>.</p>
                    <p style={body}><span style={bold}>17.2</span> All disputes arising out of or in connection with this Agreement shall be subject to the <span style={bold}>exclusive jurisdiction of the courts at Ghaziabad, Uttar Pradesh</span>.</p>

                    <HR />

                    <h3 style={sectionHeading}>18. SEVERABILITY</h3>
                    <p style={body}>If any provision of this Agreement is found invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be deemed modified only to the extent necessary to make it enforceable, and the remaining provisions shall continue in full force and effect.</p>

                    <HR />

                    <h3 style={sectionHeading}>19. ENTIRE AGREEMENT &amp; PRIOR UNDERSTANDINGS</h3>
                    <p style={body}>This Agreement, read with the Employment Agreement, constitutes the entire understanding between the Parties with respect to confidentiality, non-solicitation and non-competition obligations and supersedes all prior discussions or understandings on these subjects.</p>

                    <HR />
                    <h3 style={sectionHeading}>20. AMENDMENT</h3>
                    <p style={body}>No modification or amendment of this Agreement shall be valid unless made in writing and signed by an authorised representative of the Company and the Employee.</p>

                    <HR />
                    <h3 style={sectionHeading}>21. ACKNOWLEDGEMENT &amp; EXECUTION</h3>

                    <p style={body}>Employee acknowledge(s) that he or she has reviewed this Agreement prior to signing it, that he or she knows and understands the contents, purposes, and effect of this Agreement, and that he or she has been given a signed copy of this Agreement for his or her records. Employee further acknowledges and agrees that he or she has entered into this Agreement freely, without any duress or coercion.</p>
                    <p style={body}>In witness whereof, the undersigned state that they have carefully read this agreement and know and understand the contents thereof and that they agree to be bound and abide by the representations, covenants, promises, and warranties contained herein.</p>

                    <HR />
                    <h3 style={sectionHeading}>22. SIGNATURES</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 16 }}>
                        <InlineField label="Employee Name" value={data.candidateName || ''} labelWidth={120} />
                        <InlineField label="Employee Address" value={data.residentOf1 ? `${data.residentOf1} ${data.residentOf2 || ''}` : ''} labelWidth={120} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 20 }}>
                        <InlineField label="Employee Signature" value="" labelWidth={120} />
                        <InlineField label="Date" value={formatDate(data.employeeSignatureDate)} labelWidth={120} />
                    </div>

                    <HR />
                    <h3 style={sectionHeading}>23. SIGNATURES</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 16 }}>
                        <InlineField label="Representative Name" value={`${data.representativeName || 'Vijay Sharma'} | ${data.representativeDesignation || 'Managing Director'}`} labelWidth={120} />
                        <InlineField label="Company Address" value={data.companyAddress || '12/52, Site 2, Sunrise Industrial Area, Mohan Nagar, Ghaziabad-201017, UP, Bharat.'} labelWidth={120} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 20 }}>
                        <InlineField label="Employer Sign & Stamp" value="" labelWidth={120} />
                        <InlineField label="Date" value={formatDate(data.employerSignatureDate)} labelWidth={120} />
                    </div>

                    <HR />

                    <div style={{ marginTop: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 16 }}>
                                <InlineField
                                    label="1st Witness Name"
                                    value={`${data.witness1Name || 'Mr. Abhay Raj'} | ${data.witness1Designation || 'Sales Executive'}`}
                                    labelWidth={120}
                                />
                                <InlineField
                                    label="Witness Address"
                                    value={data.witness1Address || ''}
                                    labelWidth={120}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 20 }}>
                                <InlineField label="Witness Signature" value="" labelWidth={120} />
                                <InlineField label="Date" value={formatDate(data.witness1SignatureDate)} labelWidth={120} />
                            </div>
                        </div>

                        {data.witness2Name && (
                            <div style={{ marginBottom: 16, borderTop: '1px solid black', paddingTop: 20 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 16 }}>
                                    <InlineField
                                        label="2nd Witness Name"
                                        value={`${data.witness2Name} | ${data.witness2Designation || ''}`}
                                        labelWidth={120}
                                    />
                                    <InlineField
                                        label="Witness Address"
                                        value={data.witness2Address || ''}
                                        labelWidth={120}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 40px', marginBottom: 20 }}>
                                    <InlineField label="Witness Signature" value="" labelWidth={120} />
                                    <InlineField label="Date" value={formatDate(data.witness2SignatureDate)} labelWidth={120} />
                                </div>
                            </div>
                        )}
                    </div>

                </PageWrapper>

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
                    }
                        
                    .no-print { display: none !important; }
                    .print-page-break { page-break-after: always; break-after: page; min-height: 0 !important; }
                    .print\:w-full { width: 100% !important; }
                    .print\:max-w-full { max-width: 100% !important; }
                    .print\\:mx-auto { margin-left: auto !important; margin-right: auto !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    .print\\:p-\\[8mm\\] { padding: 8mm !important; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:mb-0 { margin-bottom: 0 !important; }
                    .print\\:min-h-\\[297mm\\] { min-height: 297mm !important; }
                    .print\\:flex { display: flex !important; }
                    .print\\:flex-col { flex-direction: column !important; }
                    .print\\:relative { position: relative !important; }
                    p, span, div, li, h3 {
                        font-family: Poppins, Inter, -apple-system, BlinkMacSystemFont,
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                        color: #000000 !important;
                    }
                }
            `}</style>
        </div>
    );
}
