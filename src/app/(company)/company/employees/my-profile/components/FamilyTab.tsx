import React from 'react';
import {
  Users, Plus, MoreVertical, Pencil, Trash2, ShieldAlert, Contact, FileBadge2, UploadCloud
} from 'lucide-react';
import { ImageIcon, CreditCard, FileCheck2 } from 'lucide-react';

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

export function FamilyTab({ profileCard }: { profileCard?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col xl:flex-row gap-1 h-full">
        {profileCard && (
          <div className="w-full xl:w-[220px] shrink-0 h-full">
            {profileCard}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1 h-full">
          {/* Family Members Section */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Users size={12} className="text-[#1d4ed8]" />
                <h3 className="text-[10px] font-bold text-zinc-900">Family Members</h3>
              </div>
              <div className="flex gap-1">
                <button className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-100">
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
                    <th className="pb-1.5 pl-2 font-semibold">Name</th>
                    <th className="pb-1.5 font-semibold">Relationship</th>
                    <th className="pb-1.5 font-semibold">Date of Birth</th>
                    <th className="pb-1.5 font-semibold">Age</th>
                    <th className="pb-1.5 font-semibold">Gender</th>
                    <th className="pb-1.5 font-semibold">Occupation</th>
                    <th className="pb-1.5 font-semibold">Mobile Number</th>
                    <th className="pb-1.5 font-semibold">Email ID</th>
                    <th className="pb-1.5 font-semibold text-center">Dependent</th>
                    <th className="pb-1.5 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 capitalize">
                  {familyMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-zinc-50/50">
                      <td className="py-1.5 pl-2">
                        <div className="flex items-center gap-1.5">
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
                        <div className="flex items-center justify-center gap-1">
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
            <p className="mt-1 text-[10px] text-zinc-500 font-medium">
              * Dependent members are considered for insurance, tax benefits and other company policies.
            </p>
          </div>

          {/* Emergency & Other Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-9 gap-1">
            {/* Emergency Contacts */}
            <div className="col-span-5 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center justify-between border-b border-zinc-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <ShieldAlert size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Emergency Contacts</h3>
                </div>
              </div>
              <div className="flex-1">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[#1d4ed8] ">
                      <th className="pb-1 px-0.5 font-semibold">Name</th>
                      <th className="pb-1 px-0.5 font-semibold">Relationship</th>
                      <th className="pb-1 px-0.5 font-semibold">Mobile No.</th>
                      <th className="pb-1 px-0.5 font-semibold">Alternate No.</th>
                      <th className="pb-1 px-0.5 font-semibold">Address</th>
                      <th className="pb-1 px-0.5 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 capitalize">
                    {emergencyContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td className="py-2 px-0.5 font-semibold text-zinc-900">{contact.name}</td>
                        <td className="py-2 px-0.5 text-zinc-600">{contact.relation}</td>
                        <td className="py-2 px-0.5 text-zinc-600">{contact.mobile}</td>
                        <td className="py-2 px-0.5 text-zinc-600">{contact.altMobile}</td>
                        <td className="py-2 px-0.5 text-zinc-600 whitespace-pre-line leading-tight">{contact.address}</td>
                        <td className="py-2 px-0.5">
                          <div className="flex justify-center gap-1">
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
              <div className="mt-1">
                <button className="flex items-center gap-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:underline">
                  <Plus size={12} /> Add Emergency Contact
                </button>
              </div>
            </div>

            {/* Other Family Information */}
            <div className="col-span-4 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center justify-between border-b border-zinc-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <Contact size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900 uppercase">Other Family Information</h3>
                </div>
                <button className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold text-[#1d4ed8] hover:bg-zinc-50">
                  Edit
                </button>
              </div>
              <div className="space-y-1 text-[10px] flex-1">
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
      <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
        <div className="mb-1 flex items-center gap-1">
          <FileBadge2 size={12} className="text-[#1d4ed8]" />
          <h3 className="text-[10px] font-bold text-zinc-900">Documents Uploaded</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-1">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-zinc-200 p-2 relative group hover:border-zinc-300">
              <div className="flex items-start gap-1.5">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${doc.iconBg}`}>
                  <doc.icon size={12} className={doc.iconColor} />
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
              <div className="mt-1 pt-1.5 border-t border-zinc-100 flex items-center gap-1 text-[10px] text-zinc-500">
                <span>Uploaded on</span>
                <span className="font-medium text-zinc-900">{doc.date}</span>
              </div>
            </div>
          ))}

          {/* Upload Card */}
          <div className="rounded-lg  border border-[#1d4ed8]/30 bg-blue-50/30 p-2 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 cursor-pointer transition-colors min-h-[80px]">
            <UploadCloud size={24} className="text-[#1d4ed8] mb-1" />
            <p className="text-[10px] font-semibold text-[#1d4ed8]">Upload Document</p>
            <p className="text-[10px] text-zinc-500 mt-1">PDF, JPG, PNG (Max. 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
