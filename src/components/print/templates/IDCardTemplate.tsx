'use client';

import { useEffect, useState } from "react";
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Loader2, User } from "lucide-react";
import { formatEmployeeId } from '@/lib/utils';

export default function IDCardTemplate({ candidateId }: { candidateId: string }) {
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr?: any) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    useEffect(() => {
        const fetchEmp = async () => {
            try {
                setLoading(true);
                if (candidateId) {
                    let cardData: any = null;
                    try {
                        const res = await api.get('/hiring/id-card', { params: { candidateId } });
                        const d = res.data;
                        cardData = Array.isArray(d) ? d[0] : (d?.data?.[0] || d?.data || d);
                    } catch (e) {
                        try {
                            const res2 = await api.get('/hiring/idcard', { params: { candidateId } });
                            const d2 = res2.data;
                            cardData = Array.isArray(d2) ? d2[0] : (d2?.data?.[0] || d2?.data || d2);
                        } catch (e2) {}
                    }

                    // Fetch candidate hiring profile to ensure all fields are populated if missing
                    let hiringProfile: any = null;
                    try {
                        const hpRes = await api.get(`/hiring/candidates/${candidateId}/hiring-profile`);
                        hiringProfile = hpRes.data;
                    } catch (e) {}

                    let cand: any = null;
                    try {
                        const candRes = await api.get(`/hiring/candidates/${candidateId}`);
                        cand = candRes.data;
                    } catch (e) {}

                    const candidateData = cand || hiringProfile?.candidate;
                    const joining = hiringProfile?.joiningForm || {};
                    const personal = joining?.personalDetails || {};
                    const contact = joining?.contactDetails || {};
                    const position = joining?.positionDetails || {};
                    const emergency = joining?.emergencyContact || {};
                    const manpower = hiringProfile?.manpower || {};
                    const joiningConfirmation = hiringProfile?.joiningConfirmation || {};

                    const empName = cardData?.employeeName ||
                        (candidateData ? `${candidateData.firstName || ''} ${candidateData.lastName || ''}`.trim() : '') ||
                        personal?.fullName ||
                        '';

                    const empCode = formatEmployeeId(
                        cardData?.employeeCode ||
                        cardData?.empCode ||
                        cardData?.uniqueId ||
                        candidateData?.employeeCode ||
                        candidateData?.uniqueId ||
                        candidateData?.candidateCode ||
                        ''
                    );

                    const desig = cardData?.designation ||
                        candidateData?.jobRole ||
                        position?.designation ||
                        manpower?.designation ||
                        '';

                    const joinDate = cardData?.joiningDate ||
                        formatDate(position?.joiningDate || joiningConfirmation?.confirmedJoiningDate || joiningConfirmation?.joiningDate) ||
                        '';

                    const birthDate = cardData?.dob ||
                        formatDate(personal?.dob || candidateData?.applicationDetails?.dob) ||
                        '';

                    const bGroup = cardData?.bloodGroup ||
                        personal?.bloodGroup ||
                        '';

                    const fName = cardData?.fatherName ||
                        personal?.fatherMotherName ||
                        '';

                    const resAddress = cardData?.residenceAddress ||
                        contact?.currentAddress ||
                        contact?.permanentAddress ||
                        '';

                    const emgName = cardData?.emergencyContactName ||
                        emergency?.name ||
                        joining?.emergencyName ||
                        fName ||
                        '';

                    const emgNos = cardData?.emergencyContactNos ||
                        [emergency?.mobileNumber || joining?.emergencyMobile, emergency?.alternateNumber || joining?.emergencyAlternate].filter(Boolean).join(', ') ||
                        '';

                    const hod = cardData?.hodName ||
                        (manpower?.reportingTo ? `${manpower.reportingTo.firstName || ''} ${manpower.reportingTo.lastName || ''}`.trim() : '') ||
                        position?.reportingManager ||
                        'Vinay Jayant';

                    const hodPhone = cardData?.contactNo ||
                        manpower?.reportingTo?.mobileNumber ||
                        manpower?.reportingTo?.phone ||
                        '9810247319';

                    const hodEmail = cardData?.emailId ||
                        manpower?.reportingTo?.email ||
                        'vijay@designhouse.co.in';

                    const photoUrl = cardData?.photo ||
                        candidateData?.profileImageUrl ||
                        joining?.employeeImage ||
                        '';

                    const finalData = {
                        employeeName: empName || 'Employee Name',
                        designation: desig || 'Designation',
                        employeeCode: empCode || '—',
                        uniqueId: empCode || '—',
                        joiningDate: joinDate || '—',
                        dob: birthDate || '—',
                        bloodGroup: bGroup || '—',
                        fatherName: fName || '—',
                        residenceAddress: resAddress || '—',
                        emergencyContactName: emgName || '—',
                        emergencyContactNos: emgNos || '—',
                        hodName: hod,
                        contactNo: hodPhone,
                        emailId: hodEmail,
                        photo: photoUrl,
                        companyName: cardData?.companyName || 'Design House India Pvt. Ltd.',
                        headOfficeAddress: cardData?.headOfficeAddress || '12/51, Site II, Loni Road Industrial Area, Mohan Nagar Ghaziabad-201007 Uttar Pradesh, Bharat'
                    };

                    setEmployee(finalData);

                    setTimeout(() => {
                        window.print();
                    }, 600);
                } else {
                    toast.error('No candidate ID provided');
                }
            } catch (err) {
                console.error('Failed to fetch ID Card details:', err);
                toast.error('Failed to fetch ID Card details');
            } finally {
                setLoading(false);
            }
        };
        fetchEmp();
    }, [candidateId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading ID Card Preview...</p>
            </div>
        );
    }

    if (!employee) return <div className="p-10 text-center font-bold text-red-500">Candidate data not found</div>;

    return (
        <div className="w-full text-black pb-10 min-h-screen bg-slate-50 print:bg-white text-[11px] leading-tight relative" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            {/* Main print container */}
            <div className="max-w-[800px] mx-auto pt-10 print:pt-0 flex gap-4 print:gap-[20px] justify-center items-start h-full pb-10 print-scale">

                {/* FRONT SIDE */}
                <div className="w-[202px] h-[340px] bg-white border border-gray-300 flex flex-col items-center relative overflow-hidden">

                    {/* Logo + Title */}
                    <div className="pt-3 flex flex-col items-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-[50px] max-w-[170px] object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                    </div>

                    {/* Photo */}
                    <div className="mt-2 w-[100px] h-[100px] rounded-full border-[3px] border-[#2f6ea5] overflow-hidden flex items-center justify-center bg-slate-100">
                        {employee.photo ? (
                            <img src={employee.photo} alt={employee.employeeName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#2f6ea5]">
                                <User className="w-12 h-12 stroke-[1.5]" />
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <h2 className="text-[16px] font-bold text-gray-700 mt-1 text-center px-2 line-clamp-1">
                        {employee.employeeName}
                    </h2>

                    <p className="text-[11px] font-medium text-gray-500 -mt-0.5 text-center px-2 line-clamp-1">
                        {employee.designation}
                    </p>

                    {/* Details */}
                    <div className="mt-2 w-full px-5 text-[9px] font-semibold text-gray-500 space-y-1">

                        <div className="flex">
                            <span className="w-[60px] shrink-0">Unique ID</span>
                            <span className="w-[6px] shrink-0 text-center">:</span>
                            <span className="ml-2 font-mono font-bold text-gray-700 truncate">{formatEmployeeId(employee.employeeCode || employee.uniqueId)}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[60px] shrink-0">Joining Date</span>
                            <span className="w-[6px] shrink-0 text-center">:</span>
                            <span className="ml-2 truncate">{employee.joiningDate}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[60px] shrink-0">Date of Birth</span>
                            <span className="w-[6px] shrink-0 text-center">:</span>
                            <span className="ml-2 truncate">{employee.dob}</span>
                        </div>

                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-0 w-full">

                        {/* Light Blue Strip */}
                        <div className="w-full h-[2px] bg-[#169ee0]"></div>

                        {/* Dark Blue Footer */}
                        <div className="bg-[#173a5e] text-white text-center py-1 px-1">
                            <p className="text-[11px] underline font-bold">Head Office</p>
                            <p className="text-[9.5px] leading-tight whitespace-pre-line">
                                {employee.headOfficeAddress || "12/51, Site II, Loni Road Industrial Area,\nMohan Nagar Ghaziabad-201007\nUttar Pradesh, Bharat"}
                            </p>
                        </div>
                    </div>
                </div>


                {/* BACK SIDE */}
                <div className="w-[202px] h-[340px] bg-white border border-gray-300 font-semibold flex flex-col relative overflow-hidden">

                    {/* Logo */}
                    <div className="pt-3 flex flex-col items-center">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-[50px] max-w-[170px] object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                    </div>

                    {/* Content */}
                    <div className="px-[12px] pt-1 pb-[80px] text-[8.5px] font-semibold text-gray-700 tracking-[0.2px] space-y-[3.5px]">

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Blood Group</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1 font-bold text-gray-800">{employee.bloodGroup}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Father Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1 truncate">{employee.fatherName}</span>
                        </div>

                        {/* Address */}
                        <p className="underline text-gray-700 mt-[4px] font-semibold">Residence Address</p>
                        <p className="leading-[1.25] text-gray-700 line-clamp-3">{employee.residenceAddress}</p>

                        {/* Emergency */}
                        <p className="underline text-gray-700 mt-[4px] font-semibold">
                            In Case of Emergency, Please Contact
                        </p>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Father Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1 truncate">{employee.emergencyContactName}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="w-[82px] shrink-0 text-gray-700">Contact Nos.</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="text-[7px] whitespace-nowrap">{employee.emergencyContactNos}</span>
                        </div>

                        {/* Office */}
                        <p className="underline text-gray-700 mt-[4px] font-semibold">Office Contact Details</p>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">HOD Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1 truncate">{employee.hodName}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Contact No.</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.contactNo}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="w-[82px] shrink-0 text-gray-700">Email Id</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="text-[7px] whitespace-nowrap truncate">{employee.emailId}</span>
                        </div>

                    </div>

                    {/* Footer curve */}
                    <div className="absolute bottom-0 w-full" style={{ height: "65px", lineHeight: 0 }}>
                        <svg
                            viewBox="0 0 202 80"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                            style={{ display: "block" }}
                        >
                            {/* Dark navy main fill */}
                            <path
                                d="M0,38 Q101,-4 202,38 L202,80 L0,80 Z"
                                fill="#173a5e"
                            />
                            {/* Thin cyan accent strip */}
                            <path
                                d="M0,34 Q101,-8 202,34 L202,38 Q101,-4 0,38 Z"
                                fill="#169ee0"
                            />
                        </svg>

                        <div className="absolute bottom-[6px] w-full text-center text-white text-[8px] px-2 leading-[1.4]">
                            This Card is the Property of<br />
                            <b>{employee.companyName || 'Design House India Pvt. Ltd.'}</b><br />
                            If Found Please return to us immediately.
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 1.3cm; }
                    body, html, #root, main, .page-container {
                        background-color: white !important;
                    }
                    .no-print { display: none !important; }
                    aside, nav, header { display: none !important; }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-scale {
                        transform: scale(1.6);
                        transform-origin: top center;
                        margin-top: 40px !important;
                    }
                }
            `}</style>
        </div>
    );
}
