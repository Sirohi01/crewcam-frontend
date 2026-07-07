import React from 'react';
import {
  Landmark, Copy, Plus, Pencil, Trash2, FileDigit, FileText, Download, UploadCloud, ShieldCheck, Clock, Info
} from 'lucide-react';

const primaryBank = {
  bankName: 'HDFC Bank',
  accountHolder: 'Rohan Mehta',
  accountNumber: '5010 1234 5678 90',
  ifsc: 'HDFC0001234',
  micr: '110240002',
  accountType: 'Savings Account',
  branchName: 'Noida Sector 18',
  branchAddress: 'HDFC Bank, Sector 18,\nNoida, Uttar Pradesh - 201301',
  nomineeName: 'Neha Mehta (Sister)',
  nomineeRelation: 'Sister',
  upiId: 'rohan.mehta@hdfcbank',
  status: 'Active',
  addedOn: '15 Mar 2023'
};

const otherAccounts = [
  { id: 1, bank: 'State Bank of India', accNum: '3456 7890 1234', type: 'Savings Account', ifsc: 'SBIN0001234', holder: 'Rohan Mehta', status: 'Active' },
  { id: 2, bank: 'ICICI Bank', accNum: '1234 5678 9012', type: 'Savings Account', ifsc: 'ICIC0001234', holder: 'Rohan Mehta', status: 'Active' },
  { id: 3, bank: 'Kotak Mahindra Bank', accNum: '9876 5432 1098', type: 'Savings Account', ifsc: 'KKBK0001234', holder: 'Rohan Mehta', status: 'Inactive' },
];

const bankDocuments = [
  { id: 1, name: 'Cancelled Cheque / Passbook', date: '15 Mar 2023', status: 'Verified' },
  { id: 2, name: 'Bank Account Proof', date: '15 Mar 2023', status: 'Verified' },
  { id: 3, name: 'IFSC Code Proof', date: '15 Mar 2023', status: 'Verified' },
  { id: 4, name: 'Nominee Proof (If Applicable)', date: '15 Mar 2023', status: 'Verified' },
];

export function BankTab({ profileCard }: { profileCard?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col xl:flex-row gap-1 h-full">
        {profileCard && (
          <div className="w-full xl:w-[220px] shrink-0 h-full">
            {profileCard}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-1 h-full">
          {/* Primary Bank Account */}
          <div className="rounded-xl border border-zinc-200 bg-white p-2 shadow-sm">
            <div className="mb-1 flex items-center justify-between border-b border-zinc-100 pb-1.5">
              <div className="flex items-center gap-1">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                  <Landmark size={12} className="text-[#1d4ed8]" />
                </div>
                <h3 className="text-[11px] font-bold text-zinc-900">Primary Bank Account</h3>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                  Primary Account
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-700">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div> Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[10px] mb-1.5">
              {/* Column 1 */}
              <div className="space-y-1">
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Bank Name</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.bankName}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Account Holder</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.accountHolder}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Account Number</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.accountNumber}</span>
                </div>
                <div className="grid grid-cols-5 items-center">
                  <span className="col-span-2 text-zinc-500">IFSC Code</span>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <span className="font-medium text-zinc-900">{primaryBank.ifsc}</span>
                    <button className="rounded bg-blue-50/50 border border-blue-100 p-0.5 text-[#1d4ed8] hover:bg-blue-100"><Copy size={10} /></button>
                  </div>
                </div>
                <div className="grid grid-cols-5 items-center">
                  <span className="col-span-2 text-zinc-500">MICR Code</span>
                  <div className="col-span-3 flex items-center gap-1.5">
                    <span className="font-medium text-zinc-900">{primaryBank.micr}</span>
                    <button className="rounded bg-blue-50/50 border border-blue-100 p-0.5 text-[#1d4ed8] hover:bg-blue-100"><Copy size={10} /></button>
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-1">
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Account Type</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.accountType}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Branch Name</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.branchName}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Branch Address</span>
                  <span className="col-span-3 font-medium text-zinc-900 whitespace-pre-line leading-tight">{primaryBank.branchAddress}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Nominee Name</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.nomineeName}</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Nominee Relationship</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.nomineeRelation}</span>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-1">
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">UPI ID</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.upiId}</span>
                </div>
                <div className="grid grid-cols-5 items-center">
                  <span className="col-span-2 text-zinc-500">Salary Account</span>
                  <span className="col-span-3 inline-block w-max rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">Yes</span>
                </div>
                <div className="grid grid-cols-5 items-center">
                  <span className="col-span-2 text-zinc-500">PF/ESIC Linked</span>
                  <span className="col-span-3 inline-block w-max rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">Yes</span>
                </div>
                <div className="grid grid-cols-5 items-center">
                  <span className="col-span-2 text-zinc-500">Status</span>
                  <span className="col-span-3 inline-block w-max rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">Active</span>
                </div>
                <div className="grid grid-cols-5">
                  <span className="col-span-2 text-zinc-500">Added On</span>
                  <span className="col-span-3 font-medium text-zinc-900">{primaryBank.addedOn}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-[#f0f4ff] p-1.5 text-[10px] text-[#1d4ed8] font-medium border border-blue-100">
              <Info size={12} className="fill-[#1d4ed8] text-white shrink-0" />
              This is your primary account. Your salary and reimbursements will be credited to this account.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {/* Other Bank Accounts */}
            <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center justify-between border-b border-zinc-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <Landmark size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900">Other Bank Accounts</h3>
                </div>
                <button className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2 py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-100">
                  <Plus size={12} /> Add New Account
                </button>
              </div>

              <div className="overflow-x-auto flex-1 mb-1.5">
                <table className="w-full text-left text-[10px]">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[#1d4ed8] whitespace-nowrap">
                      <th className="pb-1 font-semibold pl-1">Bank Name</th>
                      <th className="pb-1 font-semibold">Account Number</th>
                      <th className="pb-1 font-semibold">Account Type</th>
                      <th className="pb-1 font-semibold">IFSC</th>
                      <th className="pb-1 font-semibold">Account Holder</th>
                      <th className="pb-1 font-semibold text-center">Status</th>
                      <th className="pb-1 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 capitalize">
                    {otherAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-zinc-50/50">
                        <td className="py-1.5 pl-1 font-semibold text-zinc-900">{acc.bank}</td>
                        <td className="py-1.5 text-zinc-600">{acc.accNum}</td>
                        <td className="py-1.5 text-zinc-600">{acc.type}</td>
                        <td className="py-1.5 text-zinc-600">{acc.ifsc}</td>
                        <td className="py-1.5 text-zinc-600">{acc.holder}</td>
                        <td className="py-1.5 text-center">
                          <span className={`inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold border ${acc.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                            }`}>
                            {acc.status}
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
              <div className="mt-1.5">
                <p className="text-[10px] text-zinc-500 font-medium">
                  * Inactive accounts are not used for salary or reimbursements.
                </p>
              </div>
            </div>

            {/* Bank Documents */}
            <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                  <FileDigit size={12} className="text-[#1d4ed8]" />
                </div>
                <h3 className="text-[11px] font-bold text-zinc-900">Bank Documents</h3>
              </div>

              <div className="space-y-1 flex-1">
                {bankDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-1">
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50 text-[#1d4ed8]">
                        <FileText size={12} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-900 leading-tight">{doc.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Uploaded on {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                        {doc.status}
                      </span>
                      <button className="grid h-4 w-4 place-items-center rounded border border-blue-100 text-[#1d4ed8] hover:bg-blue-50">
                        <Download size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#1d4ed8] bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-50">
                <UploadCloud size={12} /> Upload New Document
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-2 shadow-sm flex items-start lg:items-center justify-between flex-col lg:flex-row gap-1">
        <div className="flex items-start gap-1">
          <div className="mt-0.5 rounded-full bg-violet-100 p-1 text-violet-600">
            <ShieldCheck size={12} />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-violet-900 mb-1">Important Information</h3>
            <ul className="list-disc pl-4 text-[10px] text-violet-800/80 space-y-0.5 marker:text-violet-400">
              <li>Ensure your bank details are correct to avoid payment failures.</li>
              <li>It is mandatory to keep your primary account active for salary credits.</li>
              <li>In case of any changes, please update your bank details and documents.</li>
            </ul>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-100/50 px-2 py-1.5 text-[10px] font-semibold text-violet-700 hover:bg-violet-200 transition-colors">
          <Clock size={12} /> View Bank Update History
        </button>
      </div>
    </div>
  );
}
