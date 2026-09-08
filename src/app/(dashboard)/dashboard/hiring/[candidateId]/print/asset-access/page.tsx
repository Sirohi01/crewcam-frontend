'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PrintHiringHeader from '@/components/common/PrintHiringHeader';

export default function ITAssetsPrint() {
    const params = useParams<{ candidateId: string }>();
    const id = params?.candidateId;
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchRecord();
    }, [id]);

    const fetchRecord = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/hiring/asset-access?candidateId=${id}`);
            const record = Array.isArray(response.data) ? response.data[response.data.length - 1] : (response.data?.data ? response.data.data[response.data.data.length - 1] : null);
            setData(record);
        } catch (error: any) {
            toast.error('Failed to fetch IT Assets details');
            router.push(`/dashboard/hiring/${id}/steps/asset-access`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading IT Assets Preview...</p>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500 font-bold">Data not found</div>;

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        // Handle DD/MM/YYYY or MM/DD/YYYY formats
        if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                // Assume DD/MM/YYYY if first part > 12, else try to parse
                let day = parts[0];
                let month = parts[1];
                let year = parts[2];

                // If year is first (YYYY/MM/DD)
                if (parts[0].length === 4) {
                    year = parts[0];
                    month = parts[1];
                    day = parts[2];
                }

                const monthIndex = parseInt(month) - 1;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (monthIndex >= 0 && monthIndex < 12) {
                    return `${day.padStart(2, '0')} ${months[monthIndex]} ${year}`;
                }
            }
        }

        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/,/g, '');
        } catch {
            return dateStr;
        }
    };

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

    const CheckBox = ({ checked }: { checked: boolean }) => (
        <span style={{
            display: 'inline-block', width: 10, height: 10,
            border: '1.2px solid #475569', flexShrink: 0,
            backgroundColor: checked ? '#0d3c68' : 'white',
            position: 'relative', verticalAlign: 'middle',
        }}>
            {checked && (
                <span style={{ position: 'absolute', top: -2, left: 0, fontSize: 9, color: 'white', fontWeight: 900 }}>✓</span>
            )}
        </span>
    );

    const InlineField = ({ label, value, labelWidth = 140, isEmail = false }: { label: string; value?: string; labelWidth?: number; isEmail?: boolean }) => (
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 11, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>
            <span style={{ whiteSpace: 'nowrap', flexShrink: 0, width: labelWidth }}>{label}</span>
            <span style={{ flexShrink: 0, marginRight: 6 }}>:</span>
            <span className="print-line" style={{
                flexGrow: 1, borderBottom: '1px solid #cbd5e1',
                paddingBottom: 1, paddingLeft: 4, paddingRight: 4,
                fontWeight: 500, fontSize: 11, wordBreak: 'break-word',
                display: 'inline-block', lineHeight: '1.4', textTransform: isEmail ? 'lowercase' : 'capitalize'
            }}>
                {value || '\u00A0'}
            </span>
        </div>
    );

    return (
        <div className="page-container bg-slate-50/50 min-h-screen print:bg-white print:py-0 print:px-0">
            {/* Screen Header - Hidden on print */}
            <div className="no-print border-b-2 border-[#0d3c68] pb-1 mb-2 pt-2">
                <h1 className="text-xl font-bold text-[#0d3c68] uppercase tracking-tight font-poppins px-4">IT ASSETS PREVIEW</h1>
            </div>

            {/* Controls - Hidden on print */}
            <div className="flex items-center justify-between no-print mb-4 px-4">
                <button
                    onClick={() => router.push(`/dashboard/hiring/${id}/steps/asset-access`)}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0d3c68] font-bold text-[10px] transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    BACK TO LIST
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[#0d3c68] text-white px-5 py-1.5 rounded-[2px] shadow-sm hover:bg-[#0a2e50] font-bold text-[10px] transition-all"
                >
                    <Printer className="h-4 w-4" />
                    PRINT FORM
                </button>
            </div>

            {/* PRINT VIEW */}
            <div className="max-w-[900px] mx-auto print:w-full print:max-w-full print:mx-auto bg-white shadow-lg print:shadow-none p-6 md:p-8 print:p-0">
                <div className='print:p-0'>

                    {/* --- PAGE 1 --- */}
                    <div className="relative print:h-[268mm]">
                        <PrintHiringHeader
                            title="IT ASSETS / IT ACCESS / STATIONERY FORM"
                            subtitle="(For Internal Use – IT Department)"
                            step={18}
                        />

                        <div className="print-page" style={{ position: "relative" }}>

                            {/* 1. Employee Info */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>1. Employee Information</SectionTitle>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px 40px' }}>
                                    <InlineField label="Employee Name" labelWidth={140} value={data.candidateName} />
                                    <InlineField label="Unique ID (if issued)" labelWidth={140} value={data.uniqueId} />
                                    <InlineField label="Personal Email" labelWidth={140} value={data.personalEmail} isEmail />
                                    <InlineField label="Official Email ID" labelWidth={140} value={data.officialEmail} isEmail />
                                    <InlineField label="Mobile Number" labelWidth={140} value={data.mobileNumber} />
                                </div>
                            </section>

                            <Divider />

                            {/* 2. IT Access */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>2. IT Access Required (Tick all that apply)</SectionTitle>
                                <div className="space-y-3 px-1">
                                    <div>
                                        <h3 className="text-[11px] font-bold text-slate-900 mb-2 ">A. Email & Communication Access</h3>
                                        <div className="grid grid-cols-2 gap-y-2">
                                            {['Official Email ID', 'Calendar Access', 'Mailing Groups / Distribution Lists', 'Video Conferencing Tools (Meet/Zoom)']
                                                .filter(opt => (data.access_email || []).includes(opt))
                                                .map(opt => (
                                                    <div key={opt} className="flex items-center gap-2">
                                                        <CheckBox checked={true} />
                                                        <span className="text-[10.5px] font-medium text-slate-800">{opt}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-bold text-slate-900 mb-2 ">B. System / Application Access</h3>
                                        <div className="grid grid-cols-3 gap-y-2">
                                            {[
                                                'CRM System',
                                                'Finance / Billing Software',
                                                'HRMS / Attendance App',
                                                'Project Management Tools',
                                                'Sales Tools / Lead System',
                                                'Internal Portals / Dashboards',
                                                'Cloud Storage'
                                            ]
                                                .filter(opt => (data.access_system || []).includes(opt))
                                                .map(opt => (
                                                    <div key={opt} className="flex items-center gap-2">
                                                        <CheckBox checked={true} />
                                                        <span className="text-[10.5px] font-medium text-slate-800">{opt}</span>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="mt-2">
                                            <InlineField label="Any Other" labelWidth={140} value={data.system_other} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-bold text-slate-900 mb-2 ">C. Device & Network Access</h3>
                                        <div className="grid grid-cols-3 gap-y-2">
                                            {[
                                                'Laptop / Desktop Assigned',
                                                'Biometric Access',
                                                'Mobile Phone',
                                                'Wi-Fi / Internet Access',
                                                'Charger / Accessories',
                                                'VPN Access'
                                            ]
                                                .filter(opt => (data.access_device || []).includes(opt))
                                                .map(opt => (
                                                    <div key={opt} className="flex items-center gap-2">
                                                        <CheckBox checked={true} />
                                                        <span className="text-[10.5px] font-medium text-slate-800">{opt}</span>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="mt-2">
                                            <InlineField label="Shared Folder Access" labelWidth={140} value={data.sharedFolder_other} />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Divider />

                            {/* 3. Access Level */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>3. Access Level Required</SectionTitle>
                                <div className="space-y-2 px-1">
                                    <div className="flex gap-4">
                                        {['Basic User', 'Standard User', 'Manager / Admin Access']
                                            .filter(lvl => data.accessLevel === lvl)
                                            .map(lvl => (
                                                <div key={lvl} className="flex items-center gap-2">
                                                    <CheckBox checked={true} />
                                                    <span className="text-[10.5px] font-medium text-slate-800">{lvl}</span>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="mt-2">
                                        <InlineField label="Restricted Access" labelWidth={140} value={data.restrictedRolesDetailed} />
                                    </div>
                                </div>
                            </section>

                            <Divider />

                            {/* 4. Personal Device */}
                            <section style={{ marginBottom: 8 }}>
                                <SectionTitle>4. Personal Device Declaration</SectionTitle>
                                <div className="space-y-2 px-1 text-[10.5px]">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <InlineField label="Device Type" labelWidth={140} value={data.deviceType} />
                                        <div></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <InlineField label="Serial No" labelWidth={140} value={data.serialNo} />
                                        <InlineField label="Model No" labelWidth={140} value={data.modelNo} />
                                    </div>
                                    <div className="mt-2">
                                        <InlineField label="Software Installed" labelWidth={140} value={data.softwareInstalled} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <CheckBox checked={data.usePersonalDevice || false} />
                                        <span className="text-[10px] font-medium text-slate-800 italic">Employee requests to use a personal laptop/mobile for Company work.</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-[9px] text-slate-700 font-bold border-t border-slate-200 pt-2">
                                        <p className="uppercase text-slate-900 mb-1">Note:</p>
                                        <div className="flex gap-2">
                                            <span className="text-black text-[12px] leading-none">•</span>
                                            <p>Personal devices <strong>must be checked and cleared by the IT Team</strong> before use.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-black text-[12px] leading-none">•</span>
                                            <p>No personal software/apps may be used for company work without approval.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Divider />



                        </div>

                        {/* Page 1 number */}
                        <div className="absolute bottom-0 right-4 text-[9px] text-[#64748b] font-semibold hidden print:block">
                            Page 1 / 3
                        </div>
                    </div>

                    {/* --- PAGE BREAK --- */}
                    <div className="print-page-break"></div>

                    {/* --- PAGE 2 --- */}
                    <div className="relative print:h-[268mm] print:pt-6">
                        <div className="absolute top-4 right-1 text-xs font-semibold  hidden print:block text-[#64748b]">Step 18</div>

                        {/* 5. Physical Assets */}
                        <section className="page-break-inside-avoid">
                            <SectionTitle>5. Physical Assets & Stationery</SectionTitle>
                            <div className="px-1 overflow-x-auto">
                                <table className="w-full border-collapse border-y-[1.5px] border-slate-900 text-[10px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-y border-slate-900">
                                            <th className="px-2 py-1 text-center  font-bold text-slate-900 border-x border-slate-900 w-12 whitespace-nowrap">Sr. No.</th>
                                            <th className="px-2 py-1 text-left  font-bold text-slate-900 border-r border-slate-900">Asset Name</th>
                                            <th className="px-2 py-1 text-left  font-bold text-slate-900 border-r border-slate-900 w-[25%]">Description</th>
                                            <th className="px-2 py-1 text-center font-bold text-slate-900 border-r border-slate-900 w-16">Quantity</th>
                                            <th className="px-2 py-1 text-left font-bold text-slate-900 border-r border-slate-900 w-24">Condition</th>
                                            <th className="px-2 py-1 text-left font-bold text-slate-900 border-r border-slate-900">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-b border-slate-900">
                                        {(data.assets || []).map((a: any, i: number) => (
                                            <tr key={i} className="border-b border-slate-300 last:border-b-0 min-h-[22px]">
                                                <td className="px-2 py-1 text-center font-bold border-x border-slate-900">{i + 1}</td>
                                                <td className="px-2 py-1 font-bold text-slate-900 border-r border-slate-900">{a.name}</td>
                                                <td className="px-2 py-1 border-r border-slate-900 italic">{a.desc}</td>
                                                <td className="px-2 py-1 text-center border-r border-slate-900 font-bold">{a.qty}</td>
                                                <td className="px-2 py-1 border-r border-slate-900 truncate">{a.cond}</td>
                                                <td className="px-2 py-1 border-r border-slate-900 italic text-[9px]">{a.remarks}</td>
                                            </tr>
                                        ))}
                                        {(!data.assets || data.assets.length === 0) && (
                                            <tr className="border-b border-slate-300 min-h-[22px]">
                                                <td className="px-2 py-1 text-center border-x border-slate-900">-</td>
                                                <td className="px-2 py-1 border-r border-slate-900">-</td>
                                                <td className="px-2 py-1 border-r border-slate-900">-</td>
                                                <td className="px-2 py-1 border-r border-slate-900">-</td>
                                                <td className="px-2 py-1 border-r border-slate-900">-</td>
                                                <td className="px-2 py-1 border-r border-slate-900">-</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <Divider />

                        {/* 6. IT Dept Section */}
                        <section style={{ marginBottom: 8 }}>
                            <SectionTitle>6. IT Department Section (For IT Use Only)</SectionTitle>
                            <div className="space-y-3 px-1 text-[10.5px]">
                                <div className="grid grid-cols-2 gap-x-12">
                                    <InlineField label="Processed By" labelWidth={140} value={data.processedBy} />
                                    <InlineField label="Access Created On" labelWidth={140} value={formatDate(data.accessCreatedOn)} />
                                </div>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-2">
                                    {/* Row 1 */}
                                    <InlineField label="Laptop No." labelWidth={140} value={data.itemsIssued?.laptopNo} />
                                    <div className="grid grid-cols-2 gap-2 text-[10px] items-center font-bold text-slate-800">
                                        {data.itemsIssued?.charger && (
                                            <div className="flex items-center gap-2">
                                                <CheckBox checked={true} />
                                                <span className="truncate">Charger</span>
                                            </div>
                                        )}
                                        {data.itemsIssued?.softwareInstalledIT && (
                                            <div className="flex items-center gap-2">
                                                <CheckBox checked={true} />
                                                <span className="truncate">Software Installed</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Row 2 */}
                                    <InlineField label="Mobile Device" labelWidth={140} value={data.itemsIssued?.mobileDevice} />
                                    <div className="grid grid-cols-2 gap-2 text-[10px] items-center font-bold text-slate-800">
                                        {data.itemsIssued?.emailAccountCreated && (
                                            <div className="flex items-center gap-2">
                                                <CheckBox checked={true} />
                                                <span className="truncate">Email Account</span>
                                            </div>
                                        )}
                                        {data.itemsIssued?.wifiCredentials && (
                                            <div className="flex items-center gap-2">
                                                <CheckBox checked={true} />
                                                <span className="truncate">Wi-Fi Credentials</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Row 3 */}
                                    <InlineField label="Social Media Account" labelWidth={140} value={data.itemsIssued?.socialMediaAccount} />
                                    <InlineField label="Any Other" labelWidth={140} value={data.itemsIssued?.anyOtherIT} />
                                </div>
                                <div className="mt-2 pt-2">
                                    <InlineField label="Remarks" labelWidth={140} value={data.itRemarks} />
                                </div>
                            </div>
                        </section>

                        {/* Page 2 number */}
                        <div className="absolute bottom-0 right-4 text-[9px] text-[#64748b] font-semibold hidden print:block">
                            Page 2 / 3
                        </div>
                    </div>

                    {/* --- PAGE BREAK --- */}
                    <div className="print-page-break"></div>

                    {/* --- PAGE 3 --- */}
                    <div className="relative print:h-[268mm] print:pt-6">
                        <div className="absolute top-4 right-1 text-xs font-semibold  hidden print:block text-[#64748b]">Step 18</div>





                        <Divider />


                        {/* 7. Responsibility */}
                        <section style={{ marginBottom: 16 }}>
                            <h2 className="font-bold text-[11.5pt] uppercase tracking-tight text-center mb-4 text-[#2e2e2e]">
                                EMPLOYEE RESPONSIBILITY & LIABILITY ACCEPTANCE
                            </h2>
                            <div className="px-1 mt-4 space-y-2" style={{ fontSize: '11px', lineHeight: 1.5, color: 'rgb(15, 23, 42)', fontWeight: 500, margin: '0px', textAlign: 'justify' }}>
                                {/* <p>
                                    <span className="font-bold">I,</span> <span className="border-b border-black px-1 data-value capitalize font-bold">{data.candidateName}</span> (Employee Name), hereby acknowledge, declare, and agree as follows:
                                </p> */}
                                <ol className="list-decimal ml-8 space-y-2">
                                     <span className="font-bold ">I,</span> <span className="border-b border-black px-1 data-value capitalize font-bold">{data.candidateName}</span> (Employee Name), hereby acknowledge, declare, and agree as follows:
                                    <li>I accept <strong>full personal responsibility and legal accountability</strong> for the proper, lawful, and compliant use of all Company-issued assets, including (but not limited to) email ID, mobile number/SIM, software access, digital accounts, stationery, and any other tools or resources provided to me.</li>
                                    <li>Any communication, message, email, file, or content transmitted from my <strong>Company-issued email ID, mobile number/SIM, or digital access shall be deemed to have been sent by me</strong>, and I shall be solely and fully responsible for its implications, legal consequences, and liabilities.</li>
                                    <li>I shall not use Company assets or communication channels for any <strong>unauthorised, illegal, unethical, defamatory, fraudulent, or non-business purposes</strong>, and I understand that any such misuse will constitute a serious breach of Company policy.</li>
                                    <li>I shall <strong>not share, disclose, forward, or permit access</strong> to any login credentials, passwords, OTPs, SIM details, confidential information, or system access with any third person under any circumstances.</li>
                                    <li>I acknowledge that the Company may monitor, audit, log, and review any communication or activity carried out using its systems, networks, or accounts for security, compliance, and investigation purposes.</li>
                                    <li>I understand and agree that any misuse, data leakage, policy violation, or wrongful act committed using Company equipment, email ID, SIM, or digital access—whether intentional or due to negligence—shall make me personally liable for disciplinary action, financial recovery, termination of employment, and legal proceedings under applicable Indian laws, including IT Act 2000 and IPC provisions relating to breach of trust and data misuse.</li>
                                    <li>All assets issued to me remain the exclusive property of the Company, and I shall return them in good working condition upon demand, resignation, or termination. Failure to return may result in recovery from my dues.</li>
                                    <li>I confirm that I have read, understood, and agree to abide by all IT Policies, HR Policies, Confidentiality & Data Protection Obligations, and any violation shall attract penalties as determined by the Company.</li>
                                </ol>
                            </div>
                        </section>
                        <Divider />

                        {/* Employee Declaration */}
                        <section style={{ marginBottom: 20 }}>
                            <SectionTitle>Employee Declaration</SectionTitle>
                            <p className="text-[10px] text-slate-800 font-medium italic mb-3">
                                I hereby declare that I have read this statement in full, understood its legal implications, and voluntarily agree to be bound by its terms.
                            </p>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                                <InlineField label="Employee Name" labelWidth={140} value={data.candidateName} />
                                <InlineField label="Employee Signature" labelWidth={140} value="" />
                                <InlineField label="Signature Date" labelWidth={140} value={formatDate(data.signatureDate)} />
                                <InlineField label="Signature Place" labelWidth={140} value="Mohan Nagar, Ghaziabad" />
                            </div>
                        </section>

                        {/* 8. Department Head Approval */}
                        <section style={{ marginBottom: 20 }}>
                            <SectionTitle>7. Department Head Approval</SectionTitle>
                            <p className="text-[10px] text-slate-800 font-medium italic mb-3">
                                I confirm the above access is required for the employee's job role.
                            </p>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                                <InlineField label="Name" labelWidth={140} value="Vijay Sharma" />
                                <InlineField label="Designation" labelWidth={140} value="Managing Director" />
                                <InlineField label="Signature" labelWidth={140} value="" />
                                <InlineField label="Date" labelWidth={140} value="" />
                            </div>
                        </section>

                        <Divider />

                        {/* 9. IT Manager Final Verification */}
                        <section style={{ marginBottom: 20 }}>
                            <SectionTitle>8. IT Manager Final Verification</SectionTitle>
                            <p className="text-[10px] text-slate-800 font-medium italic mb-3">
                                All requested access has been successfully configured and verified.
                            </p>
                            <div className="grid grid-cols-3 gap-6">
                                <InlineField label="IT Manager Name" labelWidth={100} value="" />
                                <InlineField label="Signature" labelWidth={70} value="" />
                                <InlineField label="Date" labelWidth={50} value="" />
                            </div>
                        </section>

                        {/* Page 3 number */}
                        <div className="absolute bottom-0 right-4 text-[9px] text-[#64748b] font-semibold hidden print:block">
                            Page 3 / 3
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                
                @media print {
                    .max-w-\\[900px\\] { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    .p-6, .md\\:p-8 { padding: 0 !important; }
                    @page { size: A4 portrait; margin: 1.3cm; }
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
                    .print-page-break {
                        break-before: page !important;
                        page-break-before: always !important;
                    }
                }
                @media screen {
                    .print-only { display: none !important; }
                }

                .font-poppins { font-family: 'Poppins', sans-serif; }
                .data-value {
                    display: inline-block;
                    vertical-align: bottom;
                }
            `}</style>
        </div>
    );
}
