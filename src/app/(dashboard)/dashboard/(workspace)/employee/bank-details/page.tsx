'use client';

import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import toast from 'react-hot-toast';
import { Eye, Edit3, Landmark, Info, ShieldCheck, FileDigit, UploadCloud } from 'lucide-react';
import { BankBadge as Badge, BankField as Field, HR_MANAGED_BANK as HR_MANAGED } from '@/components/profile/BankFields';
import { useMyBankDetails, useMyDetails, useMyProfile } from '@/hooks/useMyProfile';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

export default function BankDetailsPage() {
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: bank, isLoading: bankLoading } = useMyBankDetails();
  const { data: details } = useMyDetails();
  const nominee = details?.familyInfo;
  const verified = bank?.status === 'Verified';

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
              <span className="font-semibold text-zinc-800">Bank Details</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c21]">Bank Details</h1>
            <p className="text-[10px] text-zinc-500 mt-1">View your banking information for salary payments and other refunds.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/view-public-profile" className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50">
              <Eye size={12} /> View Public Profile
            </Link>
            <button onClick={() => toast(HR_MANAGED, { icon: 'ℹ️' })} className="flex items-center gap-2 rounded-md bg-[#1d4ed8] px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-700">
              <Edit3 size={12} /> Edit Bank Details
            </button>
          </div>
        </div>

        <ProfileTabs active="Bank Details" />

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
          <ProfileSummaryCard profile={profile} isLoading={profileLoading} />

          <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">

            {/* Primary Bank Account */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <Landmark size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900">Primary Bank Account</h3>
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

              {bankLoading ? (
                <p className="py-6 text-center text-[10px] text-zinc-400">Loading…</p>
              ) : !bank ? (
                <p className="py-6 text-center text-[10px] text-zinc-500">No bank account on file yet. {HR_MANAGED}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] mb-3">
                  <div className="space-y-2">
                    <Field label="Bank Name" value={bank.bankName} />
                    <Field label="Account Holder" value={bank.accountHolderName} />
                    <Field label="Account Number" value={bank.accountNumber} />
                    <Field label="IFSC Code" value={bank.ifscCode} copyable />
                    <Field label="MICR Code" value={bank.micrCode} copyable />
                  </div>
                  <div className="space-y-2">
                    <Field label="Account Type" value={bank.accountType ? `${bank.accountType} Account` : undefined} />
                    <Field label="Branch Name" value={bank.branchName} />
                    <Field label="Nominee Name" value={nominee?.nomineeName} />
                    <Field label="Nominee Relationship" value={nominee?.nomineeRelationship} />
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 items-center">
                      <span className="col-span-2 text-zinc-500">Salary Account</span>
                      <Badge>Yes</Badge>
                    </div>
                    <div className="grid grid-cols-5 items-center">
                      <span className="col-span-2 text-zinc-500">Status</span>
                      <Badge tone={verified ? 'green' : 'amber'}>{bank.status || 'Pending'}</Badge>
                    </div>
                    <Field label="Last Updated" value={bank.updatedAt ? moment(bank.updatedAt).format('DD MMM YYYY') : undefined} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-[#f0f4ff] p-2.5 text-[10px] text-[#1d4ed8] font-medium border border-blue-100">
                <Info size={12} className="fill-[#1d4ed8] text-white shrink-0" />
                This is your primary account. Your salary and reimbursements will be credited to this account.
              </div>
            </div>

            {/* Other Accounts & Documents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

              {/* Other Bank Accounts — only one salary account is held today */}
              <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                      <Landmark size={12} className="text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-[11px] font-bold text-zinc-900">Other Bank Accounts</h3>
                  </div>
                </div>
                <p className="flex-1 py-4 text-center text-[10px] text-zinc-500">No other accounts on file. {HR_MANAGED}</p>
                <div className="mt-3">
                  <p className="text-[10px] text-zinc-500 font-medium">
                    * Inactive accounts are not used for salary or reimbursements.
                  </p>
                </div>
              </div>

              {/* Bank Documents — document storage arrives in Phase 1D */}
              <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col h-full">
                <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50">
                    <FileDigit size={12} className="text-[#1d4ed8]" />
                  </div>
                  <h3 className="text-[11px] font-bold text-zinc-900">Bank Documents</h3>
                </div>
                <p className="flex-1 py-4 text-center text-[10px] text-zinc-500">Document upload is coming soon.</p>
                <button disabled title="Coming soon" className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#1d4ed8] bg-white py-1.5 text-[10px] font-semibold text-[#1d4ed8] opacity-60 cursor-not-allowed">
                  <UploadCloud size={12} /> Upload New Document
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50/50 p-4 shadow-sm flex items-start lg:items-center justify-between flex-col lg:flex-row gap-2">
          <div className="flex items-start gap-2">
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

      </div>
    </div>
  );
}
