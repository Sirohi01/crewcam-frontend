'use client';
import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Loader2, Plus, X, Send, FileText, Phone, MessageCircle, Mail, Check,
  Pencil, FolderClosed, Wallet, UserCircle2, MessageSquareText, Users, Globe,
} from 'lucide-react';
import api from '@/lib/axios';
import { STAGE_LABELS } from '@/lib/leadStages';

const STAGES = ['LEAD', 'DEMO_SCHEDULED', 'PROPOSAL_SENT', 'QUOTATION_APPROVED', 'WON', 'LOST'] as const;

const STAGE_COLOR: Record<string, string> = {
  LEAD: 'bg-blue-100 text-blue-700',
  DEMO_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL_SENT: 'bg-violet-100 text-violet-700',
  QUOTATION_APPROVED: 'bg-amber-100 text-amber-700',
  WON: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-zinc-100 text-zinc-500',
};

const PROPOSAL_STATUS_COLOR: Record<string, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-600',
  SENT: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  EXPIRED: 'bg-rose-100 text-rose-700',
};

const NEXT_ACTION_SUGGESTIONS: Record<string, string> = {
  '': '',
  CALL_BACK: 'Call back to follow up.',
  SEND_EMAIL: 'Send a follow-up email.',
  SCHEDULE_DEMO: 'Schedule a product demo.',
  SEND_PROPOSAL: 'Send a proposal / quotation.',
};

function formatMoney(amount: number, currency: 'INR' | 'USD' = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

function digitsOnly(phone: string) {
  return phone.replace(/[^\d]/g, '');
}

function initials(name: string) {
  return (name || '?').trim().slice(0, 1).toUpperCase();
}

const EMPTY_ITEM = { description: '', amount: 0 };
const EMPTY_TEAM_MEMBER = { title: 'Mr', firstName: '', surname: '', designation: '', email: '', phone: '', alternatePhone: '' };

export default function LeadOverviewPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [validDays, setValidDays] = useState(14);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteError, setNoteError] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [teamMember, setTeamMember] = useState({ ...EMPTY_TEAM_MEMBER });
  const [commTab, setCommTab] = useState<'ALL' | 'EMAIL' | 'CALL' | 'LOG'>('ALL');
  const [showAllComm, setShowAllComm] = useState(false);
  const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({ companyName: '', industry: '', typeOfBusiness: '', companyWebsite: '', notes: '' });
  const [companySaving, setCompanySaving] = useState(false);
  const [companyError, setCompanyError] = useState('');

  // Status update form
  const [statusForm, setStatusForm] = useState({ stage: '', nextAction: '', assignedTo: '', followUpDate: '', remark: '' });
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['super-admin', 'lead', id],
    queryFn: async () => (await api.get(`/super-admin/leads/${id}`)).data,
  });

  const { data: packages } = useQuery({
    queryKey: ['super-admin', 'packages'],
    queryFn: async () => (await api.get('/super-admin/packages')).data,
    enabled: isModalOpen,
  });

  const { data: assignableUsers } = useQuery({
    queryKey: ['super-admin', 'leads', 'assignable-users'],
    queryFn: async () => (await api.get('/super-admin/leads/assignable-users')).data,
  });

  React.useEffect(() => {
    if (lead) {
      setStatusForm((f) => ({
        ...f,
        stage: lead.stage,
        assignedTo: lead.assignedTo?._id || '',
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate).toISOString().slice(0, 16) : '',
      }));
    }
  }, [lead]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'lead', id] });

  const openModal = () => {
    setItems([{ ...EMPTY_ITEM }]);
    setValidDays(14);
    setSelectedPackageId('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    setItems((prev) => prev.map((it, i) => i === index ? { ...it, [field]: field === 'amount' ? Number(value) || 0 : value } : it));
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    if (!packageId) return;
    const pkg = (packages || []).find((p: any) => p._id === packageId);
    if (!pkg) return;
    const isUsd = lead?.currency === 'USD';
    const planPrice = isUsd ? pkg.priceUSD : pkg.priceINR;
    const setupFee = isUsd ? pkg.setupFeeUSD : pkg.setupFeeINR;
    const planItems = [];
    if (planPrice > 0) planItems.push({ description: `${pkg.name} Plan (${pkg.tier})`, amount: planPrice });
    if (setupFee > 0) planItems.push({ description: 'Setup Fee', amount: setupFee });
    setItems(planItems.length > 0 ? planItems : [{ description: `${pkg.name} Plan (${pkg.tier})`, amount: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const validItems = items.filter((it) => it.description.trim() && it.amount > 0);
    if (validItems.length === 0) {
      setFormError('Add at least one line item with a description and amount');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/super-admin/leads/${id}/proposals`, {
        items: validItems,
        validDays,
        ...(selectedPackageId && { packageId: selectedPackageId }),
      });
      setIsModalOpen(false);
      invalidate();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || 'Failed to generate proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async (proposalId: string) => {
    setSendingId(proposalId);
    setActionError('');
    try {
      await api.post(`/super-admin/leads/${id}/proposals/${proposalId}/send`);
      invalidate();
    } catch (e: any) {
      setActionError(e?.response?.data?.message || 'Failed to send proposal');
    } finally {
      setSendingId(null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) { setNoteError('Note cannot be empty'); return; }
    setSavingNote(true);
    setNoteError('');
    try {
      await api.post(`/super-admin/leads/${id}/notes`, { note: noteText.trim() });
      setIsNoteModalOpen(false);
      setNoteText('');
      invalidate();
    } catch (e: any) {
      setNoteError(e?.response?.data?.message || 'Failed to add note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    setActionError('');
    try {
      await api.post(`/super-admin/leads/${id}/send-email`, { subject: emailSubject, message: emailMessage });
      setIsEmailModalOpen(false);
      setEmailSubject('');
      setEmailMessage('');
      invalidate();
    } catch (e: any) {
      setActionError(e?.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusSaving(true);
    setStatusError('');
    try {
      await api.put(`/super-admin/leads/${id}`, {
        stage: statusForm.stage,
        ...(statusForm.assignedTo && { assignedTo: statusForm.assignedTo }),
        ...(statusForm.followUpDate && { followUpDate: new Date(statusForm.followUpDate).toISOString() }),
      });
      if (statusForm.remark.trim()) {
        await api.post(`/super-admin/leads/${id}/notes`, { note: statusForm.remark.trim() });
      }
      setStatusForm((f) => ({ ...f, nextAction: '', remark: '' }));
      invalidate();
    } catch (e: any) {
      setStatusError(e?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusSaving(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamMember.firstName.trim()) return;
    try {
      await api.put(`/super-admin/leads/${id}`, {
        additionalContacts: [...(lead.additionalContacts || []), teamMember],
      });
      setIsTeamMemberModalOpen(false);
      setTeamMember({ ...EMPTY_TEAM_MEMBER });
      invalidate();
    } catch (e: any) {
      setActionError(e?.response?.data?.message || 'Failed to add team member');
    }
  };

  const openCompanyEdit = () => {
    setCompanyForm({
      companyName: lead.companyName || '',
      industry: lead.industry || '',
      typeOfBusiness: lead.typeOfBusiness || '',
      companyWebsite: lead.companyWebsite || '',
      notes: lead.notes || '',
    });
    setCompanyError('');
    setIsCompanyEditOpen(true);
  };

  const handleCompanyEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanyError('');
    try {
      await api.put(`/super-admin/leads/${id}`, companyForm);
      setIsCompanyEditOpen(false);
      invalidate();
    } catch (e: any) {
      setCompanyError(e?.response?.data?.message || 'Failed to save changes');
    } finally {
      setCompanySaving(false);
    }
  };

  const activityTimeline = useMemo(() => {
    if (!lead) return [];
    return [
      ...(lead.stageHistory || []).map((h: any) => ({ kind: 'stage' as const, at: h.changedAt, data: h })),
      ...(lead.activityLog || []).map((a: any) => ({ kind: 'note' as const, at: a.createdAt, data: a })),
    ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  }, [lead]);

  const filteredTimeline = useMemo(() => {
    return activityTimeline.filter((entry) => {
      if (commTab === 'ALL') return true;
      if (entry.kind === 'stage') return commTab === 'LOG';
      const note: string = entry.data.note || '';
      if (commTab === 'EMAIL') return note.startsWith('Email sent:');
      if (commTab === 'CALL') return note.startsWith('Logged call:');
      return !note.startsWith('Email sent:') && !note.startsWith('Logged call:');
    });
  }, [activityTimeline, commTab]);

  if (isLoading) return <div className="p-8 text-center text-zinc-400 text-sm">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-center text-rose-500 text-sm">Lead not found.</div>;

  const whatsappLink = lead.contactPhone ? `https://wa.me/${digitsOnly(lead.contactPhone)}` : null;
  const visibleContacts = showAllContacts ? (lead.additionalContacts || []) : (lead.additionalContacts || []).slice(0, 2);
  const visibleTimeline = showAllComm ? filteredTimeline : filteredTimeline.slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/leads" className="text-zinc-400 hover:text-zinc-600">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Client Profile</h1>
          <p className="text-xs text-zinc-500">
            <Link href="/super-admin/leads" className="hover:text-zinc-700">Leads</Link> / {lead.companyName}
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {lead.contactPhone && (
            <a href={`tel:${lead.contactPhone}`} className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600" title="Call">
              <Phone size={14} />
            </a>
          )}
          <Button variant="outline" disabled={!whatsappLink} title={whatsappLink ? 'Coming soon — requires a WhatsApp Business API integration' : 'No phone number on file'} className="h-8 text-xs opacity-60 cursor-not-allowed">
            <MessageCircle size={14} className="mr-1" /> Send WhatsApp
          </Button>
        </div>
      </div>

      {actionError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{actionError}</div>}

      <div className="grid grid-cols-3 gap-3 items-start">
        <div className="col-span-2 space-y-3">
          {/* Company card */}
          <Card className="border-zinc-200/80 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xl font-md flex-shrink-0">
                  {initials(lead.companyName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-md text-zinc-900">{lead.companyName}</h2>
                    <button onClick={openCompanyEdit} title="Edit company details" className="text-zinc-400 hover:text-zinc-600">
                      <Pencil size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {lead.contactTitle} {lead.contactName} {lead.contactSurname} {lead.contactDesignation && `· ${lead.contactDesignation}`} {lead.contactPhone && `· ${lead.contactPhone}`}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    {lead.contactEmail && <a href={`mailto:${lead.contactEmail}`} className="text-indigo-600 hover:text-indigo-700">{lead.contactEmail}</a>}
                    {lead.companyWebsite && (
                      <a href={lead.companyWebsite} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-700 flex items-center gap-1">
                        <Globe size={11} /> {lead.companyWebsite}
                      </a>
                    )}
                  </div>
                </div>
                {lead.notes && (
                  <div className="w-64 flex-shrink-0 border-l border-zinc-100 pl-3">
                    <p className="text-[10px] font-md text-zinc-400 uppercase tracking-wide mb-1">About Company</p>
                    <p className="text-[11px] text-zinc-600 leading-snug line-clamp-5">{lead.notes}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-100">
                <InfoChip label="Industry / Sector" value={lead.industry || '—'} />
                <InfoChip label="Lead Generation Date" value={new Date(lead.leadDate || lead.createdAt).toLocaleString()} />
                <InfoChip label="Type of Business" value={lead.typeOfBusiness || '—'} />
                <InfoChip
                  label="Client Status"
                  value={<span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STAGE_COLOR[lead.stage]}`}>{STAGE_LABELS[lead.stage] || lead.stage}</span>}
                />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <ActionTile icon={<FileText size={16} />} label="Proposals" onClick={() => document.getElementById('proposals-section')?.scrollIntoView({ behavior: 'smooth' })} />
                <ActionTile icon={<MessageSquareText size={16} />} label="Add Note" onClick={() => { setNoteText(''); setNoteError(''); setIsNoteModalOpen(true); }} />
                <ActionTile icon={<FolderClosed size={16} />} label="Documentation" disabled />
                <ActionTile icon={<Wallet size={16} />} label="Account" disabled />
                <ActionTile icon={<Users size={16} />} label="Contact Details" onClick={() => document.getElementById('contacts-section')?.scrollIntoView({ behavior: 'smooth' })} />
                <ActionTile icon={<MessageCircle size={16} />} label="WhatsApp Chat" disabled />
                <ActionTile icon={<Mail size={16} />} label="Email" onClick={() => { setEmailSubject(''); setEmailMessage(''); setIsEmailModalOpen(true); }} />
                <ActionTile icon={<Phone size={16} />} label="Call" href={lead.contactPhone ? `tel:${lead.contactPhone}` : undefined} disabled={!lead.contactPhone} />
              </div>
            </CardContent>
          </Card>

          {/* Lead status updates */}
          <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-[13px] font-md">Lead Status Updates</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {statusError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 mb-3">{statusError}</div>}
              <form onSubmit={handleUpdateStatus} className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-md text-zinc-600">Status Update</label>
                    <select value={statusForm.stage} onChange={(e) => setStatusForm((f) => ({ ...f, stage: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5">
                      {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-md text-zinc-600">Next Action</label>
                    <select
                      value={statusForm.nextAction}
                      onChange={(e) => {
                        const v = e.target.value;
                        setStatusForm((f) => ({ ...f, nextAction: v, remark: NEXT_ACTION_SUGGESTIONS[v] || f.remark }));
                      }}
                      className="w-full border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5"
                    >
                      <option value="">Select Next Action</option>
                      <option value="CALL_BACK">Call Back</option>
                      <option value="SEND_EMAIL">Send Email</option>
                      <option value="SCHEDULE_DEMO">Schedule Demo</option>
                      <option value="SEND_PROPOSAL">Send Proposal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-md text-zinc-600">Forward To</label>
                    <select value={statusForm.assignedTo} onChange={(e) => setStatusForm((f) => ({ ...f, assignedTo: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5">
                      <option value="">Unassigned</option>
                      {(assignableUsers || []).map((u: any) => <option key={u._id} value={u._id}>{u.firstName} {u.lastName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-md text-zinc-600">Follow Up Date</label>
                    <input type="datetime-local" value={statusForm.followUpDate} onChange={(e) => setStatusForm((f) => ({ ...f, followUpDate: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-xs px-2.5 py-1.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-md text-zinc-600">Remark</label>
                  <textarea value={statusForm.remark} onChange={(e) => setStatusForm((f) => ({ ...f, remark: e.target.value }))} rows={2} placeholder="Write your remark here..." className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={statusSaving} className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                    {statusSaving ? <Loader2 size={12} className="animate-spin mr-1" /> : <Send size={12} className="mr-1" />}
                    Update Status
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact details */}
          <Card id="contacts-section" className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-md">Contact Details</CardTitle>
              <div className="flex items-center gap-2">
                {(lead.additionalContacts || []).length > 2 && (
                  <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setShowAllContacts((s) => !s)}>
                    {showAllContacts ? 'Show Less' : 'View All'}
                  </Button>
                )}
                <Button size="sm" className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setTeamMember({ ...EMPTY_TEAM_MEMBER }); setIsTeamMemberModalOpen(true); }}>
                  <Plus size={12} className="mr-1" /> Add Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <ContactCard
                name={`${lead.contactTitle || ''} ${lead.contactName} ${lead.contactSurname || ''}`.trim()}
                designation={lead.contactDesignation}
                phone={lead.contactPhone}
                email={lead.contactEmail}
                primary
              />
              {visibleContacts.map((c: any, i: number) => (
                <ContactCard key={i} name={`${c.title || ''} ${c.firstName || ''} ${c.surname || ''}`.trim()} designation={c.designation} phone={c.phone} email={c.email} />
              ))}
            </CardContent>
          </Card>

          {/* Proposals */}
          <Card id="proposals-section" className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-[13px] font-md">Proposals</CardTitle>
              <Button onClick={openModal} className="h-7 text-xs bg-indigo-600 text-white hover:bg-indigo-700">
                <Plus size={13} className="mr-1" /> Generate Proposal
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {(lead.proposals || []).map((p: any) => (
                  <div key={p._id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-900 flex items-center gap-2">
                        {p.proposalNumber}
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PROPOSAL_STATUS_COLOR[p.status]}`}>{p.status}</span>
                        {p.packageId?.name && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600">{p.packageId.name}</span>
                        )}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        {formatMoney(p.totalAmount, p.currency)} · valid until {p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {p.pdfUrl && (
                        <a href={p.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                          <FileText size={13} /> PDF
                        </a>
                      )}
                      {p.status === 'DRAFT' && (
                        <Button
                          size="sm"
                          disabled={sendingId === p._id}
                          onClick={() => handleSend(p._id)}
                          className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {sendingId === p._id ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="mr-1" />}
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {(lead.proposals || []).length === 0 && (
                  <div className="p-8 text-center text-zinc-400 text-xs">No proposals generated yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat & Communication */}
        <div className="col-span-1">
          <Card className="border-zinc-200/80 shadow-sm rounded-lg overflow-hidden sticky top-4">
            <CardHeader className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-[13px] font-md mb-2">Chat &amp; Communication</CardTitle>
              <div className="flex items-center gap-1 flex-wrap">
                {([
                  { key: 'ALL', label: 'All' },
                  { key: 'EMAIL', label: 'Emails' },
                  { key: 'CALL', label: 'Calls' },
                  { key: 'LOG', label: 'Logs/Status' },
                ] as const).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setCommTab(t.key)}
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${commTab === t.key ? 'bg-indigo-600 text-white' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                  >
                    {t.label}
                  </button>
                ))}
                <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-white border border-zinc-200 text-zinc-300 cursor-not-allowed" title="Coming soon">WhatsApp</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100 max-h-[520px] overflow-y-auto">
                {visibleTimeline.map((entry, i) => entry.kind === 'stage' ? (
                  <div key={`stage-${i}`} className="px-4 py-3 flex items-start gap-2.5">
                    <UserCircle2 size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-md text-zinc-700">Profile Update</p>
                      <p className="text-xs text-zinc-600">
                        {entry.data.fromStage ? <>Moved from {STAGE_LABELS[entry.data.fromStage] || entry.data.fromStage} to </> : <>Created at </>}
                        <span className="font-medium">{STAGE_LABELS[entry.data.toStage] || entry.data.toStage}</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{formatDistanceToNow(new Date(entry.data.changedAt), { addSuffix: true })}</p>
                    </div>
                  </div>
                ) : (
                  <div key={`note-${i}`} className="px-4 py-3 flex items-start gap-2.5">
                    {entry.data.note?.startsWith('Email sent:') ? <Mail size={16} className="text-blue-500 mt-0.5 flex-shrink-0" /> : entry.data.note?.startsWith('Logged call:') ? <Phone size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" /> : <MessageSquareText size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-md text-zinc-700">
                        {entry.data.note?.startsWith('Email sent:') ? 'Email Sent' : entry.data.note?.startsWith('Logged call:') ? 'Call Logged' : 'Note'}
                      </p>
                      <p className="text-xs text-zinc-600 line-clamp-2">{entry.data.note}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {entry.data.createdBy ? `${entry.data.createdBy.firstName || ''} ${entry.data.createdBy.lastName || ''}`.trim() || entry.data.createdBy.email : 'System'} · {formatDistanceToNow(new Date(entry.data.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredTimeline.length === 0 && (
                  <div className="p-8 text-center text-zinc-400 text-xs">No communication yet.</div>
                )}
              </div>
              {filteredTimeline.length > 6 && (
                <div className="p-2 border-t border-zinc-100">
                  <button onClick={() => setShowAllComm((s) => !s)} className="w-full text-center text-xs font-medium text-emerald-700 hover:text-emerald-800 py-1.5">
                    {showAllComm ? 'Show Less' : 'View Full Communication History'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Add Note</h2>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="p-5 space-y-3">
              {noteError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{noteError}</div>}
              <textarea
                autoFocus
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="What was discussed on this call/message?"
                rows={4}
                className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2"
              />
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={savingNote} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {savingNote ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Send Email to {lead.contactEmail}</h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSendEmail} className="p-5 space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Subject</label>
                <input required value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Message</label>
                <textarea required value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} rows={5} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setIsEmailModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={sendingEmail} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {sendingEmail ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Send Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTeamMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Add Team Member</h2>
              <button onClick={() => setIsTeamMemberModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddTeamMember} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First Name" value={teamMember.firstName} onChange={(e) => setTeamMember((m) => ({ ...m, firstName: e.target.value }))} className="border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                <input placeholder="Surname" value={teamMember.surname} onChange={(e) => setTeamMember((m) => ({ ...m, surname: e.target.value }))} className="border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                <input placeholder="Designation" value={teamMember.designation} onChange={(e) => setTeamMember((m) => ({ ...m, designation: e.target.value }))} className="border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                <input placeholder="Phone" value={teamMember.phone} onChange={(e) => setTeamMember((m) => ({ ...m, phone: e.target.value }))} className="border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                <input placeholder="Email" type="email" value={teamMember.email} onChange={(e) => setTeamMember((m) => ({ ...m, email: e.target.value }))} className="col-span-2 border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setIsTeamMemberModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCompanyEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-zinc-200/50">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Edit Company Details</h2>
              <button onClick={() => setIsCompanyEditOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCompanyEditSubmit} className="p-5 space-y-3">
              {companyError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{companyError}</div>}
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Company Name</label>
                <input required value={companyForm.companyName} onChange={(e) => setCompanyForm((f) => ({ ...f, companyName: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-md text-zinc-700">Industry / Sector</label>
                  <input value={companyForm.industry} onChange={(e) => setCompanyForm((f) => ({ ...f, industry: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-md text-zinc-700">Type of Business</label>
                  <input value={companyForm.typeOfBusiness} onChange={(e) => setCompanyForm((f) => ({ ...f, typeOfBusiness: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">Company Website</label>
                <input value={companyForm.companyWebsite} onChange={(e) => setCompanyForm((f) => ({ ...f, companyWebsite: e.target.value }))} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-md text-zinc-700">About Company</label>
                <textarea value={companyForm.notes} onChange={(e) => setCompanyForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className="w-full border border-zinc-200 rounded-lg text-sm px-3 py-2" />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <Button type="button" variant="outline" onClick={() => setIsCompanyEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={companySaving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {companySaving ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto py-10">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200/50 my-auto">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-md text-zinc-900">Generate Proposal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded-md">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</div>}

              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Based on Plan (optional)</label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => handlePackageSelect(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2"
                >
                  <option value="">Custom (no plan)</option>
                  {(packages || []).map((p: any) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.tier})</option>
                  ))}
                </select>
                <p className="text-[10px] text-zinc-400">Selecting a plan auto-fills the line items below — still fully editable.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-md text-zinc-700">Line Items *</label>
                {items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => handleItemChange(i, 'description', e.target.value)}
                      className="flex-1 border border-zinc-200 rounded-lg text-sm px-3 py-2"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Amount"
                      value={it.amount || ''}
                      onChange={(e) => handleItemChange(i, 'amount', e.target.value)}
                      className="w-32 border border-zinc-200 rounded-lg text-sm px-3 py-2"
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-rose-600 px-1">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setItems((prev) => [...prev, { ...EMPTY_ITEM }])} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  + Add line item
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-md text-zinc-700">Valid For (days)</label>
                <input
                  type="number"
                  min={1}
                  value={validDays}
                  onChange={(e) => setValidDays(Number(e.target.value) || 14)}
                  className="w-full border border-zinc-200 rounded-lg text-sm px-3.5 py-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {submitting ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                  Generate Proposal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 rounded-lg px-3 py-2">
      <p className="text-[9px] font-md text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs text-zinc-800 mt-0.5">{value}</p>
    </div>
  );
}

function ActionTile({
  icon, label, onClick, href, disabled,
}: { icon: React.ReactNode; label: string; onClick?: () => void; href?: string; disabled?: boolean }) {
  const content = (
    <div className={`flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2 text-[11px] font-medium ${disabled ? 'text-zinc-300 cursor-not-allowed' : 'text-zinc-700 hover:bg-zinc-50 cursor-pointer'}`}>
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
  if (disabled) return <div title="Coming soon">{content}</div>;
  if (href) return <a href={href}>{content}</a>;
  return <button type="button" onClick={onClick} className="text-left">{content}</button>;
}

function ContactCard({
  name, designation, phone, email, primary,
}: { name: string; designation?: string; phone?: string; email?: string; primary?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-2.5">
      <div className="h-9 w-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center text-xs font-md flex-shrink-0">
        {initials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-900 truncate">{name} {primary && <span className="text-[9px] font-normal text-indigo-500">(Primary)</span>}</p>
        {designation && <p className="text-[10px] text-zinc-400">{designation}</p>}
        <div className="flex items-center gap-3 mt-0.5">
          {phone && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Phone size={9} /> {phone}</span>}
          {email && <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Mail size={9} /> {email}</span>}
        </div>
      </div>
    </div>
  );
}
