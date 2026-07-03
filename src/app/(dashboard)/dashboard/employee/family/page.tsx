import React from 'react';
import {
  Eye,
  Edit3,
  User,
  Users,
  Landmark,
  GraduationCap,
  Briefcase,
  FileText,
  Activity,
  Box,
  HeartPulse,
  PlusCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Shield,
  Image as ImageIcon,
  FileBadge2,
  CreditCard,
  FileSymlink,
  UploadCloud,
  MoreVertical,
  ShieldAlert,
  Contact,
  FileCheck2,
  Info
} from 'lucide-react';
import Link from 'next/link';

// Dummy Data matching the screenshot
const employee = {
  name: 'Rohan Mehta',
  empId: 'EMP10234',
  role: 'Executive - Sales',
  status: 'Active',
  email: 'rohan.mehta@crewcam.com',
  phone: '+91 98765 43210',
  doj: '15 Mar 2023',
  location: 'Noida Office',
  reportingTo: {
    name: 'Amit Kumar',
    role: 'Sales Manager',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  avatar: 'https://randomuser.me/api/portraits/men/44.jpg'
};

const familyMembers = [
  { id: 1, name: 'Neha Mehta', relation: 'Sister', dob: '18 Feb 1993', age: '31 Yrs', gender: 'Female', occupation: 'Software Engineer', mobile: '+91 98765 12345', email: 'neha.mehta@gmail.com', dependent: true, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Rajesh Mehta', relation: 'Father', dob: '10 Jan 1965', age: '59 Yrs', gender: 'Male', occupation: 'Business', mobile: '+91 98110 11222', email: 'rajesh.mehta@gmail.com', dependent: true, avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
  { id: 3, name: 'Sushma Mehta', relation: 'Mother', dob: '12 Mar 1968', age: '56 Yrs', gender: 'Female', occupation: 'Homemaker', mobile: '+91 98110 11333', email: 'sushma.mehta@gmail.com', dependent: true, avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 4, name: 'Aryan Mehta', relation: 'Brother', dob: '22 Sep 2001', age: '22 Yrs', gender: 'Male', occupation: 'Student', mobile: '+91 98765 54321', email: 'aryan.mehta@gmail.com', dependent: true, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
];

const emergencyContacts = [
  { id: 1, name: 'Rajesh Mehta', relation: 'Father', mobile: '+91 98110 11222', altMobile: '+91 98765 11222', address: 'A-120, Sector 50\nNoida, UP - 201301' },
  { id: 2, name: 'Neha Mehta', relation: 'Sister', mobile: '+91 98765 12345', altMobile: '+91 98110 22333', address: 'B-45, Sector 62\nNoida, UP - 201309' },
];

const documents = [
  { id: 1, name: 'Family Photo', type: 'JPG File', date: '12 Mar 2023', status: 'Verified', icon: ImageIcon, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50' },
  { id: 2, name: 'Aadhaar Card\n(Family)', type: 'PDF File', date: '12 Mar 2023', status: 'Verified', icon: Contact, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' },
  { id: 3, name: 'PAN Card\n(Family)', type: 'PDF File', date: '12 Mar 2023', status: 'Verified', icon: CreditCard, iconColor: 'text-blue-500', iconBg: 'bg-blue-50' },
  { id: 4, name: 'Address Proof\n(Family)', type: 'PDF File', date: '12 Mar 2023', status: 'Verified', icon: FileCheck2, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
];

const tabs = [
  { name: 'Personal Info', icon: User, active: false },
  { name: 'Family Details', icon: Users, active: true },
  { name: 'Bank Details', icon: Landmark, active: false },
  { name: 'Education', icon: GraduationCap, active: false },
  { name: 'Experience', icon: Briefcase, active: false },
  { name: 'Documents', icon: FileText, active: false },
  { name: 'Skills', icon: Activity, active: false },
  { name: 'Assets', icon: Box, active: false },
  { name: 'Emergency', icon: ShieldAlert, active: false },
  { name: 'More Info', icon: PlusCircle, active: false },
];

export default function FamilyDetail() {
  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans">
      <div className="mx-auto max-w-[1400px] p-0">
        {/* Breadcrumb & Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-2">
              <span>Dashboard</span>
              <span>›</span>
              <span>My Profile</span>
              <span>›</span>
              <span className="font-semibold text-zinc-800">Family Details</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Family Details</h1>
            <p className="text-[10px] text-zinc-500 mt-1">View and manage your family information.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Eye size={12} /> View Public Profile
            </button>
            <button className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-700">
              <Edit3 size={12} /> Edit Family Details
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-2 flex items-center gap-3 border-b border-zinc-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div key={tab.name} className="relative flex flex-col items-center cursor-pointer">
              <button
                className={`flex items-center gap-2 px-2 pb-3 text-[10px] font-medium whitespace-nowrap transition-colors ${tab.active ? 'text-[#1d4ed8]' : 'text-zinc-500 hover:text-zinc-800'
                  }`}
              >
                <tab.icon size={12} />
                {tab.name}
              </button>
              {/* This div acts as the extended border */}
              {tab.active && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1d4ed8]" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">

          {/* Left Sidebar - Profile Card */}
          <div className="col-span-1 space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img src={employee.avatar} alt="Profile" className="h-24 w-24 rounded-full border border-zinc-200 object-cover p-1 bg-white shadow-sm" />
              </div>
              <h2 className="flex items-center gap-2 text-[10px] font-bold text-zinc-900">
                {employee.name} <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-100" />
              </h2>
              <p className="mt-1 text-[10px] font-medium text-zinc-500">{employee.empId}</p>
              <p className="text-[10px] text-zinc-500">{employee.role}</p>
              <span className="mt-3 inline-block rounded-md bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                {employee.status}
              </span>

              <div className="mt-6 w-full space-y-4 border-t border-zinc-100 pt-6 text-left">
                <div className="flex items-center gap-3 text-[10px]">
                  <Mail size={12} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-700 truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <Phone size={12} className="text-zinc-400 shrink-0" />
                  <span className="text-zinc-700">{employee.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-[10px]">
                  <Calendar size={12} className="text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-zinc-900">{employee.doj}</p>
                    <p className="text-[10px] text-zinc-500">Date of Joining</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-[10px]">
                  <MapPin size={12} className="text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-zinc-900">{employee.location}</p>
                    <p className="text-[10px] text-zinc-500">Work Location</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-3">
                  <img src={employee.reportingTo.avatar} alt="Manager" className="h-9 w-9 rounded-full border border-zinc-200" />
                  <div>
                    <p className="text-[10px] text-zinc-500">Reporting To</p>
                    <p className="text-[10px] font-semibold text-[#1d4ed8]">{employee.reportingTo.name}</p>
                    <p className="text-[10px] text-zinc-500">{employee.reportingTo.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">

            {/* Family Members Section */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-[#1d4ed8]" />
                  <h3 className="text-[10px] font-bold text-zinc-900">Family Members</h3>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-100">
                    <Plus size={12} /> Add Family Member
                  </button>
                  <button className="p-1.5 text-zinc-400 hover:bg-zinc-100 rounded-md">
                    <MoreVertical size={12} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[#1d4ed8] font-medium text-[10px]">
                      <th className="pb-3 pl-2 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Relationship</th>
                      <th className="pb-3 font-semibold">Date of Birth</th>
                      <th className="pb-3 font-semibold">Age</th>
                      <th className="pb-3 font-semibold">Gender</th>
                      <th className="pb-3 font-semibold">Occupation</th>
                      <th className="pb-3 font-semibold">Mobile Number</th>
                      <th className="pb-3 font-semibold">Email ID</th>
                      <th className="pb-3 font-semibold text-center">Dependent</th>
                      <th className="pb-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {familyMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-zinc-50/50">
                        <td className="py-1.5 pl-2">
                          <div className="flex items-center gap-3">
                            <img src={member.avatar} alt="" className="h-6 w-6 rounded-full object-cover border border-zinc-200" />
                            <span className="font-semibold text-zinc-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 text-zinc-600">{member.relation}</td>
                        <td className="py-1.5 text-zinc-600">{member.dob}</td>
                        <td className="py-1.5 text-zinc-600">{member.age}</td>
                        <td className="py-1.5 text-zinc-600">{member.gender}</td>
                        <td className="py-1.5 text-zinc-600 whitespace-pre-line leading-tight">{member.occupation}</td>
                        <td className="py-1.5 text-zinc-600">{member.mobile}</td>
                        <td className="py-1.5 text-zinc-600">{member.email}</td>
                        <td className="py-1.5 text-center">
                          <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                            {member.dependent ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-1.5">
                          <div className="flex items-center justify-center gap-2">
                            <button className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50">
                              <Pencil size={12} />
                            </button>
                            <button className="rounded border border-red-100 p-1 text-red-500 hover:bg-red-50">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[10px] text-zinc-500 font-medium">
                * Dependent members are considered for insurance, tax benefits and other company policies.
              </p>
            </div>

            {/* Emergency & Other Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

              {/* Emergency Contacts */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                      <ShieldAlert size={12} className="text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-[11px] font-bold text-zinc-900">Emergency Contacts</h3>
                  </div>
                </div>
                <div className="flex-1">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-zinc-100 text-[#1d4ed8] whitespace-nowrap">
                        <th className="pb-2 font-semibold">Name</th>
                        <th className="pb-2 font-semibold">Relationship</th>
                        <th className="pb-2 font-semibold">Mobile Number</th>
                        <th className="pb-2 font-semibold">Alternate Number</th>
                        <th className="pb-2 font-semibold">Address</th>
                        <th className="pb-2 font-semibold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {emergencyContacts.map((contact) => (
                        <tr key={contact.id}>
                          <td className="py-2 font-semibold text-zinc-900">{contact.name}</td>
                          <td className="py-2 text-zinc-600">{contact.relation}</td>
                          <td className="py-2 text-zinc-600">{contact.mobile}</td>
                          <td className="py-2 text-zinc-600">{contact.altMobile}</td>
                          <td className="py-2 text-zinc-600 whitespace-pre-line leading-tight">{contact.address}</td>
                          <td className="py-2">
                            <div className="flex justify-center gap-2">
                              <button className="rounded border border-blue-100 p-1 text-[#1d4ed8] hover:bg-blue-50">
                                <Pencil size={12} />
                              </button>
                              <button className="rounded border border-red-100 p-1 text-red-500 hover:bg-red-50">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                    <Plus size={12} /> Add Emergency Contact
                  </button>
                </div>
              </div>

              {/* Other Family Information */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                      <Contact size={12} className="text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-[11px] font-bold text-zinc-900">Other Family Information</h3>
                  </div>
                  <button className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50">
                    Edit
                  </button>
                </div>
                <div className="space-y-2 text-[10px] flex-1">
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Family Status</span>
                    <span className="col-span-3 font-medium text-zinc-900">Nuclear Family</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">No. of Dependents</span>
                    <span className="col-span-3 font-medium text-zinc-900">4</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Spouse Name</span>
                    <span className="col-span-3 font-medium text-zinc-900">N/A</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Marriage Anniversary</span>
                    <span className="col-span-3 font-medium text-zinc-900">N/A</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Family Address</span>
                    <span className="col-span-3 font-medium text-zinc-900">A-120, Sector 50, Noida, UP - 201301</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Blood Group (Self)</span>
                    <span className="col-span-3 font-medium text-zinc-900">B+</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Family Medical History</span>
                    <span className="col-span-3 font-medium text-zinc-900">No significant medical history</span>
                  </div>
                  <div className="grid grid-cols-5">
                    <span className="col-span-2 text-zinc-500">Nominee for PF / ESIC</span>
                    <span className="col-span-3 font-medium text-zinc-900">Rajesh Mehta (Father)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Documents Uploaded Section */}
        <div className="mt-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileBadge2 size={12} className="text-[#1d4ed8]" />
            <h3 className="text-[10px] font-bold text-zinc-900">Documents Uploaded</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

            {documents.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-zinc-200 p-4 relative group hover:border-zinc-300">
                <div className="flex items-start gap-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${doc.iconBg}`}>
                    <doc.icon size={18} className={doc.iconColor} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-zinc-900 whitespace-pre-line leading-tight">{doc.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{doc.type}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                    {doc.status}
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-[10px] text-zinc-500">
                  <span>Uploaded on</span>
                  <span className="font-medium text-zinc-900">{doc.date}</span>
                </div>
              </div>
            ))}

            {/* Upload Card */}
            <div className="rounded-lg border-2 border-dashed border-[#1d4ed8]/30 bg-blue-50/30 p-4 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 cursor-pointer transition-colors min-h-[140px]">
              <UploadCloud size={24} className="text-[#1d4ed8] mb-2" />
              <p className="text-[10px] font-semibold text-[#1d4ed8]">Upload Document</p>
              <p className="text-[10px] text-zinc-500 mt-1">PDF, JPG, PNG (Max. 5MB)</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

