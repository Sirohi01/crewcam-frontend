'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toAssetUrl } from '@/lib/fileUrls';
import { 
  ArrowLeft, Save, Eye, Send, FileText, ChevronDown, 
  MapPin, Briefcase, Calendar, User, Search, Ticket, Users, 
  Building2, CalendarDays, Coins, CheckSquare, Plus, Check, Info, FileSignature, MoveDiagonal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

function CreateOfferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get('candidateId');
  
  const [candidate, setCandidate] = useState<any>(null);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidateId) {
      setLoading(true);
      api.get(`/hiring/candidates/${candidateId}`)
        .then(res => setCandidate(res.data.data || res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      // Fetch candidates for dropdown if no candidate is selected
      api.get('/hiring/candidates')
        .then(res => setCandidatesList(res.data.data || res.data || []))
        .catch(console.error);
    }
  }, [candidateId]);

  const handleSaveDraft = async () => {
    if (!candidate) {
      window.alert('Please select a candidate first.');
      return;
    }
    
    try {
      setLoading(true);
      const payload = {
        candidateId: candidate._id || candidate.id,
        candidateName: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
        department: candidate?.departmentId?.name || candidate?.department || '',
        departmentId: candidate?.departmentId?._id || candidate?.departmentId || undefined,
        designation: candidate.jobRole || '',
        annualCTC: "840000",
        monthlyCTC: "70000",
        location: "New Delhi",
        joiningDate: new Date("2026-11-02"),
        validUntil: new Date("2026-10-20"),
        status: 'Draft',
      };
      
      const res = await api.post('/hiring/offer-letter', payload);
      window.alert('Offer Draft Saved Successfully!');
      router.push('/dashboard/offers');
    } catch (err: any) {
      console.error('Error saving draft:', err);
      window.alert(err?.response?.data?.message || 'Failed to save offer draft');
    } finally {
      setLoading(false);
    }
  };

  const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}` : '';
  const candidateEmail = candidate?.email || '';
  const candidatePhone = candidate?.phone || '';
  const candidateRole = candidate?.jobRole || '';
  const candidateFirstName = candidate?.firstName || '';
  const candidateJobId = candidate?.candidateCode || candidate?.uniqueId || '';
  const candidateDepartment = candidate?.departmentId?.name || candidate?.department || '';
  const rawPhoto = toAssetUrl(candidate?.profileImageUrl || candidate?.applicationDetails?.profile_photo || candidate?.applicationDetails?.photo) || null;
  const initials = candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Top Nav / Breadcrumbs */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <div className="mb-3">
          <Link href="/dashboard/offers" className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-indigo-700 hover:bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
            <ArrowLeft className="h-3 w-3" /> Back to Offers
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-none">Create Offer</h1>
              <p className="text-[10.5px] font-medium text-slate-500 mt-1">Prepare, customize and send an offer to the selected candidate</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSaveDraft}
              disabled={!candidateId || loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-800 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <Save className="h-3.5 w-3.5 text-indigo-700" /> {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-800 hover:bg-slate-50 shadow-sm transition-colors">
              <Eye className="h-3.5 w-3.5 text-indigo-700" /> Preview Offer
            </button>
            <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors">
              <Send className="h-3.5 w-3.5" /> Send Offer
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2 mt-2">
        {!candidateId ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900 mb-0.5">Select a Candidate</h2>
                <p className="text-[11px] text-slate-500">Select a candidate to automatically populate their details and generate the offer letter.</p>
              </div>
            </div>
            <div className="w-full md:w-[320px] relative">
              <select 
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/dashboard/offers/create?candidateId=${e.target.value}`);
                  }
                }}
              >
                <option value="">-- Choose Candidate --</option>
                {candidatesList.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.firstName} {c.lastName} ({c.jobRole})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        ) : (
          <>
            {/* Candidate Info Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden p-2.5">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 xl:w-[260px] shrink-0">
              {rawPhoto ? (
                <img
                  src={rawPhoto}
                  alt="Candidate"
                  className="h-9 w-9 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const sibling = target.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="h-9 w-9 rounded-full bg-indigo-100 items-center justify-center"
                style={{ display: rawPhoto ? 'none' : 'flex' }}
              >
                <span className="text-[12px] font-bold text-indigo-600 select-none">{initials || '??'}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-[13px] font-semibold text-slate-900 leading-none">{candidateName}</h2>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 leading-none">Selected</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1 leading-[1.2] w-[140px] truncate">{candidateEmail} | {candidatePhone}</p>
              </div>
            </div>
            
            <div className="hidden xl:block w-px h-8 bg-slate-100 shrink-0"></div>
            
            <div className="flex items-center justify-between xl:w-[280px] px-1 shrink-0">
              <div className="flex flex-col justify-center">
                <p className="text-[12px] font-semibold text-slate-900 leading-none">{candidateRole}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 leading-none">{candidateJobId}</p>
              </div>
              <button className="rounded-md bg-indigo-50 px-3 py-1.5 text-[10.5px] font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
                View Profile
              </button>
            </div>

            <div className="hidden xl:block w-px h-8 bg-slate-100 shrink-0"></div>

            <div className="flex items-center justify-between flex-1 pl-2 pr-4 shrink-0 gap-6 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-indigo-50 text-indigo-500"><User className="h-3.5 w-3.5" strokeWidth={2} /></div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 leading-none">{candidateDepartment}</p>
                  <p className="text-[9.5px] text-slate-500 font-medium mt-1 leading-none">Department</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-indigo-50 text-indigo-500"><MapPin className="h-3.5 w-3.5" strokeWidth={2} /></div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 leading-none">New Delhi</p>
                  <p className="text-[9.5px] text-slate-500 font-medium mt-1 leading-none">Work Location</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-indigo-50 text-indigo-500"><CalendarDays className="h-3.5 w-3.5" strokeWidth={2} /></div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 leading-none">Full Time</p>
                  <p className="text-[9.5px] text-slate-500 font-medium mt-1 leading-none">Employment Type</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-indigo-50 text-indigo-500"><Calendar className="h-3.5 w-3.5" strokeWidth={2} /></div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-900 leading-none">10 Oct 2026</p>
                  <p className="text-[9.5px] text-slate-500 font-medium mt-1 leading-none">Expected Joining</p>
                </div>
              </div>
            </div>
          </div>
          </div>
          </>
        )}

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-2 ${!candidateId ? 'opacity-60 pointer-events-none grayscale-[0.2]' : ''}`}>
          
          {/* Left Column (Forms) */}
          <div className="space-y-2">
            
            {/* 1. Offer Details Section */}
            <div>
              <div className="flex items-start gap-1.5 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-50 text-indigo-600"><FileText className="h-3.5 w-3.5" /></div>
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-900">1. Offer Details</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">Basic information about the job offer</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Job Opening <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>{candidateRole} ({candidateJobId})</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Department <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>{candidateDepartment}</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Employment Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>Full Time</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Hiring Manager <span className="text-red-500">*</span></label>
                    <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-2 py-1">
                      <div className="flex items-center gap-1.5">
                        <img src="https://i.pravatar.cc/150?u=r" alt="Manager" className="h-4 w-4 rounded-full" />
                        <span className="text-[11px] font-medium text-slate-700">Rishav Sharma</span>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 text-[10px]">✕</button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Work Location <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-2 h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white pl-7 pr-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>New Delhi</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Joining Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-2 h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
                      <input type="text" value="02 Nov 2026" className="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500" readOnly />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Notice Period</label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>30 Days</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Offer Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-2 h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
                      <input type="text" value="10 Oct 2026" className="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500" readOnly />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Offer Expiry Date <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-2 h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
                      <input type="text" value="20 Oct 2026" className="w-full rounded-lg border border-slate-300 bg-white pl-7 pr-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500" readOnly />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">Probation Period <Info className="w-3 h-3 text-slate-400" /></label>
                    <div className="relative">
                      <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                        <option>3 Months</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700">Probation End Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-2 top-2 h-3.5 w-3.5 text-indigo-600 pointer-events-none" />
                      <input type="text" value="01 Feb 2027" className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-7 pr-2 py-1.5 text-[11.5px] font-medium text-slate-500 outline-none cursor-not-allowed" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Compensation & Benefits Section */}
            <div>
              <div className="flex items-start gap-1.5 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-50 text-indigo-600"><Coins className="h-3.5 w-3.5" /></div>
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-900">Compensation & Benefits</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">Define salary structure, bonuses and additional benefits</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-3">
                
                {/* Compensation Details Header */}
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-indigo-200 bg-indigo-50 text-indigo-600"><Coins className="h-2.5 w-2.5" /></div>
                  <h4 className="text-[12px] font-semibold text-slate-800">Compensation Details</h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Offered CTC <span className="text-red-500">*</span></label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-[11.5px]">₹</span>
                          <input type="text" value="8,40,000" className="w-full border-y border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-900 outline-none focus:border-indigo-500" readOnly />
                          <span className="inline-flex items-center px-2 rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 text-slate-500 text-[10px]">per annum</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Salary Structure <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500">
                            <option>Annual CTC</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Joining Bonus</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-2 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-[11.5px]">₹</span>
                          <input type="text" value="25,000" className="w-full rounded-r-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-900 outline-none focus:border-indigo-500" readOnly />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">CTC in Words</label>
                        <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-[10.5px] font-medium text-slate-500">
                          Rupees Eight Lakh Forty Thousand Only
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown Card */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-[11px] font-semibold text-indigo-900">Salary Breakdown (Annual)</h5>
                      <button className="text-[9px] font-semibold text-indigo-600 border border-indigo-200 bg-white rounded px-1.5 py-0.5 hover:bg-indigo-50">Edit Breakdown</button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Donut placeholder */}
                      <div className="relative h-16 w-16 rounded-full border-[6px] border-emerald-400 border-t-amber-400 border-r-sky-500 border-b-indigo-500 flex items-center justify-center shrink-0">
                        <div className="text-center mt-0.5">
                          <p className="text-[11px] font-semibold text-slate-800 leading-none">₹8.4L</p>
                          <p className="text-[7px] font-semibold text-slate-500">Total CTC</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded bg-indigo-500"></div><span className="text-slate-700">Basic Salary</span></div>
                          <span className="text-slate-500">40%</span>
                          <span className="font-semibold text-slate-800">3,36,000</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded bg-sky-500"></div><span className="text-slate-700">HRA</span></div>
                          <span className="text-slate-500">30%</span>
                          <span className="font-semibold text-slate-800">2,52,000</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded bg-amber-400"></div><span className="text-slate-700">Special Allowance</span></div>
                          <span className="text-slate-500">20%</span>
                          <span className="font-semibold text-slate-800">1,68,000</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded bg-emerald-400"></div><span className="text-slate-700">Joining Bonus</span></div>
                          <span className="text-slate-500">10%</span>
                          <span className="font-semibold text-slate-800">84,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200 w-full my-2"></div>
                
                {/* Benefits & Perks Header */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-indigo-200 bg-indigo-50 text-indigo-600"><CheckSquare className="h-2.5 w-2.5" /></div>
                  <h4 className="text-[12px] font-semibold text-slate-800">3. Benefits & Perks</h4>
                  <span className="text-[10px] text-slate-500">Select benefits applicable for this offer</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {/* Benefit Items */}
                  <label className="flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50/50 px-2 py-1.5 cursor-pointer">
                    <div className="flex h-3 w-3 items-center justify-center rounded bg-indigo-600 text-white"><Check className="h-2 w-2" strokeWidth={3} /></div>
                    <span className="text-[10.5px] font-semibold text-indigo-900 flex items-center gap-1">
                      <Plus className="h-3 w-3 text-indigo-600" /> Health Insurance
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-400" /> Life Insurance
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50/50 px-2 py-1.5 cursor-pointer">
                    <div className="flex h-3 w-3 items-center justify-center rounded bg-indigo-600 text-white"><Check className="h-2 w-2" strokeWidth={3} /></div>
                    <span className="text-[10.5px] font-semibold text-indigo-900 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3 text-indigo-600" /> Paid Leave
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50/50 px-2 py-1.5 cursor-pointer">
                    <div className="flex h-3 w-3 items-center justify-center rounded bg-indigo-600 text-white"><Check className="h-2 w-2" strokeWidth={3} /></div>
                    <span className="text-[10.5px] font-semibold text-indigo-900 flex items-center gap-1">
                      <Coins className="h-3 w-3 text-indigo-600" /> Performance Bonus
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-slate-400" /> Provident Fund (PF)
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Coins className="h-3 w-3 text-slate-400" /> Gratuity
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-400" /> Work From Home
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" /> Relocation Allowance
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-400" /> Mobile Allowance
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-400" /> Internet Allowance
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50">
                    <div className="flex h-3 w-3 items-center justify-center rounded border border-slate-300 bg-white"></div>
                    <span className="text-[10.5px] font-semibold text-slate-700 flex items-center gap-1">
                      <CheckSquare className="h-3 w-3 text-slate-400" /> Learning & Development
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 cursor-pointer hover:bg-slate-50 border-dashed">
                    <span className="text-[10.5px] font-semibold text-indigo-600 flex items-center gap-1 mx-auto">
                      <Plus className="h-3.5 w-3.5" /> Other Benefit
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Internal Notes Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600"><FileText className="h-3.5 w-3.5" /></div>
                <div className="w-full space-y-1.5">
                  <div>
                    <h3 className="text-[12px] font-semibold text-slate-900">Internal Notes</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Add internal message</p>
                  </div>
                  <div className="relative">
                    <textarea 
                      placeholder="Add any internal notes, approval notes, or special instructions..."
                      className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white resize-none"
                    ></textarea>
                    <span className="absolute bottom-1 right-1.5 text-[9px] text-slate-400">0/500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column (Document Preview) */}
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-50 text-indigo-600"><FileSignature className="h-3.5 w-3.5" /></div>
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-900">Offer Letter & Documents</h3>
                  <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Choose template, customize and attach additional documents</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-4 border-b border-slate-200 mb-3 px-1">
                <button className="border-b-2 border-indigo-600 pb-1.5 text-[11px] font-semibold text-indigo-600">Template</button>
                <button className="border-b-2 border-transparent pb-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700">Customize</button>
                <button className="border-b-2 border-transparent pb-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700">Attachments</button>
                <button className="border-b-2 border-transparent pb-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-700">Company Policies</button>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-700">Offer Letter Template <span className="text-red-500">*</span></label>
                    <a href="#" className="text-[10px] font-semibold text-indigo-600 flex items-center gap-0.5 hover:underline"><MoveDiagonal className="h-2.5 w-2.5" /> Manage Templates</a>
                  </div>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11.5px] font-medium text-slate-800 outline-none focus:border-indigo-500">
                      <option>Standard Full-Time Offer Letter</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg flex-1 bg-slate-50 flex flex-col overflow-hidden">
                  <div className="bg-slate-100 border-b border-slate-200 px-2 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-semibold">Offer Letter Preview</span>
                    </div>
                    <div className="flex gap-2 text-slate-500">
                      <button className="hover:text-slate-800"><ArrowLeft className="h-3 w-3 rotate-90" /></button>
                      <button className="hover:text-slate-800"><MoveDiagonal className="h-3 w-3" /></button>
                    </div>
                  </div>
                  
                  {/* Document preview mock */}
                  <div className="p-4 bg-white m-2 rounded shadow-sm border border-slate-200 flex-1 overflow-y-auto text-[9px] text-slate-800 font-serif leading-relaxed h-[200px]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h1 className="text-[14px] font-semibold text-amber-500 tracking-tight font-sans flex items-center">
                          Crewcam <span className="text-slate-800 ml-0.5">HRMS</span>
                        </h1>
                        <div className="w-6 h-px bg-slate-800 mt-0.5"></div>
                      </div>
                      <div className="text-right text-[7px] text-slate-500">
                        Crewcam HRMS Pvt. Ltd.<br/>
                        123 Business Park, Sector 62<br/>
                        Noida - 201309, India
                      </div>
                    </div>
                    
                    <h2 className="text-center font-semibold text-[11px] mb-3 tracking-widest text-slate-900 font-sans">OFFER LETTER</h2>
                    
                    <p className="font-semibold mb-2 text-[10px]">Date: 10 October 2026</p>
                    
                    <p className="font-semibold mb-3 text-[10px]">Ms. {candidateName}<br/><span className="font-medium text-[8px] text-slate-600">New Delhi, India<br/>{candidateEmail}</span></p>
                    
                    <p className="mb-1.5">Dear {candidateFirstName},</p>
                    
                    <p className="mb-2">We are pleased to offer you the position of <span className="font-semibold">{candidateRole}</span> at Crewcam HRMS Pvt. Ltd. on the following terms and conditions:</p>
                    
                    <table className="w-full border-collapse border border-slate-300 mb-2 text-[8px]">
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1 w-1/3">Position</td>
                          <td className="border border-slate-300 p-1 w-2/3">{candidateRole}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1">Department</td>
                          <td className="border border-slate-300 p-1">{candidateDepartment}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1">Employment Type</td>
                          <td className="border border-slate-300 p-1">Full Time</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1">Date of Joining</td>
                          <td className="border border-slate-300 p-1">02 November 2026</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1">Annual CTC</td>
                          <td className="border border-slate-300 p-1">₹8,40,000 (Rupees Eight Lakh Forty Thousand Only)</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 bg-slate-50 font-semibold p-1">Joining Bonus</td>
                          <td className="border border-slate-300 p-1">₹25,000</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <p className="mb-2">This offer is valid until 20 October 2026. Please confirm your acceptance by signing and returning a copy of this letter.</p>
                    <p className="mb-4">We look forward to welcoming you to the Crewcam team!</p>
                    
                    <p className="mb-1">Sincerely,</p>
                    <p className="font-semibold">Rishav Sharma</p>
                    <p>Head of Marketing<br/>Crewcam HRMS Pvt. Ltd.</p>
                    
                    <div className="mt-[-15px] ml-28 opacity-70">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-6 object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="px-4 py-2 text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveDraft}
            disabled={!candidateId || loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[12.5px] font-semibold text-indigo-900 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Save className="h-4 w-4 text-indigo-700" /> {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[12.5px] font-semibold text-indigo-900 hover:bg-slate-50 shadow-sm transition-colors" disabled={!candidateId}>
            <Eye className="h-4 w-4 text-indigo-700" /> Preview Offer
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors" disabled={!candidateId}>
            <Send className="h-4 w-4" /> Send Offer
          </button>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading offer details...</div>}>
      <CreateOfferContent />
    </Suspense>
  );
};

export default Page;
