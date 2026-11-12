'use client';

import React, { useState } from 'react';
import moment from 'moment';
import { Landmark, FileDigit, UploadCloud, ShieldCheck, Info } from 'lucide-react';
import { useMyBankDetails, useMyDetails } from '@/hooks/useMyProfile';
import { BankBadge, BankField, HR_MANAGED_BANK } from '@/components/profile/BankFields';
import { ChangeRequestDialog } from '@/components/profile/ChangeRequestDialog';
import { MyChangeRequestsBanner } from '@/components/profile/MyChangeRequestsBanner';

/** Bank tab of the unified My Profile page. Read-only; same data as /dashboard/employee/bank-details. */
export function BankTab({ profileCard }: { profileCard?: React.ReactNode }) {
  const { data: bank, isLoading } = useMyBankDetails();
  const { data: details } = useMyDetails();
  const nominee = details?.familyInfo;
  const verified = bank?.status === 'Verified';
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <MyChangeRequestsBanner kind="bank" />
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
                <button onClick={() => setRequestOpen(true)} className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#1d4ed8] hover:bg-blue-100">
                  Request change
                </button>
                {bank && (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-100">
                    Primary Account
                  </span>
                )}
              </div>
              {bank && (
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-700">
                  <div className={`h-1.5 w-1.5 rounded-full ${verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  {verified ? 'Verified' : 'Pending verification'}
                </div>
              )}
            </div>

            {isLoading ? (
              <p className="py-4 text-center text-[10px] text-zinc-400">Loading…</p>
            ) : !bank ? (
              <p className="py-4 text-center text-[10px] text-zinc-500">No bank account on file yet. {HR_MANAGED_BANK}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[10px] mb-1.5">
                <div className="space-y-1">
                  <BankField label="Bank Name" value={bank.bankName} />
                  <BankField label="Account Holder" value={bank.accountHolderName} />
                  <BankField label="Account Number" value={bank.accountNumber} />
                  <BankField label="IFSC Code" value={bank.ifscCode} copyable />
                  <BankField label="MICR Code" value={bank.micrCode} copyable />
                </div>
                <div className="space-y-1">
                  <BankField label="Account Type" value={bank.accountType ? `${bank.accountType} Account` : undefined} />
                  <BankField label="Branch Name" value={bank.branchName} />
                  <BankField label="Nominee Name" value={nominee?.nomineeName} />
                  <BankField label="Nominee Relationship" value={nominee?.nomineeRelationship} />
                </div>
                <div className="space-y-1">
                  <div className="grid grid-cols-5 items-center">
                    <span className="col-span-2 text-zinc-500">Salary Account</span>
                    <BankBadge>Yes</BankBadge>
                  </div>
                  <div className="grid grid-cols-5 items-center">
                    <span className="col-span-2 text-zinc-500">Status</span>
                    <BankBadge tone={verified ? 'green' : 'amber'}>{bank.status || 'Pending'}</BankBadge>
                  </div>
                  <BankField label="Last Updated" value={bank.updatedAt ? moment(bank.updatedAt).format('DD MMM YYYY') : undefined} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 rounded-lg bg-[#f0f4ff] p-1.5 text-[10px] text-[#1d4ed8] font-medium border border-blue-100">
              <Info size={12} className="fill-[#1d4ed8] text-white shrink-0" />
              This is your primary account. Your salary and reimbursements will be credited to this account.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {/* Other Bank Accounts — only one salary account is held today */}
            <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center justify-between border-b border-zinc-100 pb-1.5">
                <div className="flex items-center gap-1">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <Landmark size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900">Other Bank Accounts</h3>
                </div>
              </div>
              <p className="flex-1 py-3 text-center text-[10px] text-zinc-500">No other accounts on file. {HR_MANAGED_BANK}</p>
              <div className="mt-1.5">
                <p className="text-[10px] text-zinc-500 font-medium">
                  * Inactive accounts are not used for salary or reimbursements.
                </p>
              </div>
            </div>

            {/* Bank Documents — document storage arrives in Phase 1D */}
            <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm flex flex-col h-full">
              <div className="mb-1 flex items-center gap-1 border-b border-zinc-100 pb-1.5">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                  <FileDigit size={12} className="text-[#1d4ed8]" />
                </div>
                <h3 className="text-[11px] font-bold text-zinc-900">Bank Documents</h3>
              </div>
              <p className="flex-1 py-3 text-center text-[10px] text-zinc-500">Document upload is coming soon.</p>
              <button disabled title="Coming soon" className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#1d4ed8] bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] opacity-60 cursor-not-allowed">
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
              <li>For security, account changes are made by HR after verification. Contact HR if your details change.</li>
            </ul>
          </div>
        </div>
      </div>
      <ChangeRequestDialog kind="bank" open={requestOpen} onClose={() => setRequestOpen(false)} />
    </div>
  );
}
