'use client';

import { useEffect, useState } from "react";
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from "lucide-react";

export default function IDCardTemplate({ candidateId }: { candidateId: string }) {
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmp = async () => {
            try {
                setLoading(true);
                if (candidateId) {
                    const res = await api.get('/hiring/idcard', { params: { candidateId } }).then(res => res.data);
                    let recordData = Array.isArray(res) ? res[0] : (res.data?.[0] || res.data || res);
                    if (recordData) {
                        setEmployee(recordData);
                    } else {
                        setEmployee(getDummy());
                    }
                } else {
                    setEmployee(getDummy());
                }
                setTimeout(() => {
                    window.print();
                }, 500);
            } catch (err) {
                toast.error('Failed to fetch ID Card details');
                setEmployee(getDummy());
            } finally {
                setLoading(false);
            }
        };
        fetchEmp();
    }, [candidateId]);

    const getDummy = () => ({
        employeeName: "Imran",
        designation: "Sr. Acrylicman",
        employeeCode: "DHIPL/20/002",
        joiningDate: "14 Nov 2017",
        dob: "01 Jan 1991",
        bloodGroup: "B+",
        fatherName: "Munshi Ali",
        residenceAddress: "44, Asalat Pur Farrukh Nagar Asalatpur farakh nagar farukh Nagar, Ghaziabad, Uttar Pradesh, Bharat",
        emergencyContactName: "Munshi Ali",
        emergencyContactNos: "7838796389, 7838796389",
        hodName: "Vinay Jayant",
        contactNo: "9810247319",
        emailId: "vijay@designhouse.co.in",
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#0d3c68]" />
                <p className="text-slate-500 font-medium tracking-tight">Loading ID Card Preview...</p>
            </div>
        );
    }

    if (!employee) return <div>Data not found</div>;

    return (
        <div className="w-full text-black pb-10 min-h-screen bg-slate-50 print:bg-white text-[11px] leading-tight relative" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            {/* Main print container */}
            <div className="max-w-[800px] mx-auto pt-10 print:pt-0 flex gap-4 print:gap-[20px] justify-center items-start h-full pb-10 print-scale">

                {/* FRONT SIDE */}
                <div className="w-[202px] h-[340px] bg-white border border-gray-300 flex flex-col items-center relative overflow-hidden">

                    {/* Logo + Title */}
                    <div className="pt-3 flex flex-col items-center">
                        <img src="/design-house.png" className="h-[60px] object-contain" />
                    </div>

                    {/* Photo */}
                    <div className="mt-2 w-[100px] h-[100px] rounded-full border-[3px] border-[#2f6ea5] overflow-hidden">
                        <img src={employee.photo || "https://randomuser.me/api/portraits/men/32.jpg"} className="w-full h-full object-cover" />
                    </div>

                    {/* Name */}
                    <h2 className="text-[18px] font-bold text-gray-600 mt-1">
                        {employee.employeeName}
                    </h2>

                    <p className="text-[12px] font-medium text-gray-500 -mt-1">
                        {employee.designation}
                    </p>

                    {/* Details */}
                    <div className="mt-2 w-full px-6 text-[9px] font-semibold text-gray-500 space-y-1 ">

                        <div className="flex">
                            <span className="w-[60px]">Unique ID</span>
                            <span className="w-[6px] text-center">:</span>
                            <span className="ml-2">{employee.employeeCode}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[60px]">Joining Date</span>
                            <span className="w-[6px] text-center">:</span>
                            <span className="ml-2">{employee.joiningDate}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[60px]">Date of Birth</span>
                            <span className="w-[6px] text-center">:</span>
                            <span className="ml-2">{employee.dob}</span>
                        </div>

                    </div>

                    {/* Bottom */}
                    <div className="absolute bottom-0 w-full">

                        {/* Light Blue Strip */}
                        <div className="w-full h-[2px] bg-[#169ee0]"></div>

                        {/* Dark Blue Footer */}
                        <div className="bg-[#173a5e] text-white text-center py-1">
                            <p className="text-[11px] underline font-bold">Head Office</p>
                            <p className="text-[10px] leading-tight">
                                12/51, Site II, Loni Road Industrial Area,
                                Mohan Nagar Ghaziabad-201007
                                Uttar Pradesh, Bharat
                            </p>
                        </div>
                    </div>
                </div>


                {/* BACK SIDE */}
                <div className="w-[202px] h-[340px] bg-white border border-gray-300 font-semibold flex flex-col relative overflow-hidden">

                    {/* Logo */}
                    <div className="pt-3 flex flex-col items-center">
                        <img src="/design-house.png" className="h-[60px]" />
                    </div>

                    {/* Content — all text now dark gray, matching front side style */}
                    <div className="px-[12px] pt-2 pb-[80px] text-[8.5px] font-semibold text-gray-700 tracking-[0.2px] space-y-[4px]">

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Blood Group</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.bloodGroup}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Father Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.fatherName}</span>
                        </div>

                        {/* Address */}
                        <p className="underline text-gray-700 mt-[6px] font-semibold">Residence Address</p>
                        <p className="leading-[1.3] text-gray-700">{employee.residenceAddress}</p>

                        {/* Emergency */}
                        <p className="underline text-gray-700 mt-[6px] font-semibold">
                            In Case of Emergency, Please Contact
                        </p>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Father Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.emergencyContactName}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="w-[82px] shrink-0 text-gray-700">Contact Nos.</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="text-[7px] whitespace-nowrap">{employee.emergencyContactNos}</span>
                        </div>

                        {/* Office */}
                        <p className="underline text-gray-700 mt-[6px] font-semibold">Office Contact Details</p>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">HOD Name</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.hodName}</span>
                        </div>

                        <div className="flex">
                            <span className="w-[82px] shrink-0 text-gray-700">Contact No.</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="ml-1">{employee.contactNo}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="w-[82px] shrink-0 text-gray-700">Email Id</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                            <span className="text-[7px] whitespace-nowrap">{employee.emailId}</span>
                        </div>

                    </div>

                    {/* Footer curve — flush to bottom, no white gap, deep curve matching Image 1 */}
                    <div className="absolute bottom-0 w-full" style={{ height: "65px", lineHeight: 0 }}>
                        <svg
                            viewBox="0 0 202 80"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                            style={{ display: "block" }}
                        >
                            {/* Dark navy main fill — deep curve */}
                            <path
                                d="M0,38 Q101,-4 202,38 L202,80 L0,80 Z"
                                fill="#173a5e"
                            />
                            {/* Thin cyan accent strip — sits right on top edge of navy, no gap */}
                            <path
                                d="M0,34 Q101,-8 202,34 L202,38 Q101,-4 0,38 Z"
                                fill="#169ee0"
                            />
                        </svg>

                        <div className="absolute bottom-[6px] w-full text-center text-white text-[8px] px-2 leading-[1.4]">
                            This Card is the Property of<br />
                            <b>Design House India Pvt. Ltd.</b><br />
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
