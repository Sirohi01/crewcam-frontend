'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Edit2, Trash2, Image as ImageIcon,
  Loader2, CheckCircle2, Link as LinkIcon, Search,
  ChevronDown, ArrowUpDown,
} from 'lucide-react';
import api from '@/lib/axios';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Banner {
  _id: string;
  imageUrl: string;
  title: string;
  primaryLabel: string;
  primaryHref: string;
  isActive: boolean;
  order: number;
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function BannersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imageUrl, setImageUrl]           = useState('');
  const [uploading, setUploading]         = useState(false);
  const [uploadError, setUploadError]     = useState('');
  const [saveError, setSaveError]         = useState('');

  // table state
  const [search, setSearch]   = useState('');
  const [perPage, setPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<keyof Banner | ''>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  /* ── queries ── */
  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ['super-admin', 'banners'],
    queryFn: async () => (await api.get('/super-admin/banners')).data,
  });

  const mutation = useMutation({
    mutationFn: async (payload: Partial<Banner>) => {
      if (editingBanner?._id)
        return api.put(`/super-admin/banners/${editingBanner._id}`, payload);
      return api.post('/super-admin/banners', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'banners'] });
      closeModal();
    },
    onError: (err: any) => {
      setSaveError(err?.response?.data?.message || err?.message || 'Unknown error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/super-admin/banners/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'banners'] }),
  });

  /* ── modal helpers ── */
  const openModal = (banner?: Banner) => {
    setEditingBanner(banner || null);
    setImageUrl(banner?.imageUrl || '');
    setUploadError(''); setSaveError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setImageUrl('');
    setUploadError(''); setSaveError('');
  };

  /* ── upload ── */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setUploadError('');
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url || res.data?.fileUrl || '';
      if (!url) throw new Error('No URL returned from server');
      setImageUrl(url);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* ── submit ── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) { setUploadError('Please upload a banner image before saving.'); return; }
    const fd = new FormData(e.target as HTMLFormElement);
    mutation.mutate({
      imageUrl,
      title:        (fd.get('title') as string)        || '',
      primaryLabel: (fd.get('primaryLabel') as string) || '',
      primaryHref:  (fd.get('primaryHref') as string)  || '',
      isActive:     fd.get('isActive') === 'true',
      order:        Number(fd.get('order') || 0),
    });
  };

  /* ── sorting + filtering ── */
  const handleSort = (key: keyof Banner) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = banners
    .filter(b =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.primaryLabel?.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      const va = a[sortKey]; const vb = b[sortKey];
      if (va === vb) return 0;
      const cmp = va < vb ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    })
    .slice(0, perPage);

  /* ── shared styles ── */
  const inputCls =
    'w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 ' +
    'placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 ' +
    'focus:border-transparent transition bg-white';

  const SortBtn = ({ col }: { col: keyof Banner }) => (
    <button
      onClick={() => handleSort(col)}
      className="ml-1 inline-flex items-center opacity-50 hover:opacity-100 transition"
    >
      <ArrowUpDown size={10} />
    </button>
  );

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="p-4 min-h-screen bg-slate-50">

      {/* ── Page header ── */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard Banners</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the hero slides shown on every tenant's dashboard.
          </p>
        </div>
        {/* ✅ Smaller Add Banner button */}
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5
                     rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={13} /> Add Banner
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={perPage}
                onChange={e => setPerPage(Number(e.target.value))}
                className="appearance-none bg-white border border-slate-200 rounded-lg
                           pl-2.5 pr-7 py-1 text-xs text-slate-700 focus:outline-none
                           focus:ring-2 focus:ring-indigo-300 cursor-pointer"
              >
                {[5, 10, 25, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2
                                                text-slate-400 pointer-events-none" />
            </div>
            <span className="text-xs text-slate-500">Entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Search:</span>
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-7 pr-2.5 py-1 text-xs border border-slate-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-300 w-48 bg-white"
              />
            </div>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              {/* ✅ Shorter black header row */}
              <tr className="bg-slate-800 text-white text-[11px] uppercase tracking-wide">
                <th className="px-3 py-2 text-left font-semibold w-20">
                  Image <SortBtn col="imageUrl" />
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Title <SortBtn col="title" />
                </th>
                <th className="px-3 py-2 text-left font-semibold w-36">
                  Button <SortBtn col="primaryLabel" />
                </th>
                <th className="px-3 py-2 text-right font-semibold w-16">
                  Order <SortBtn col="order" />
                </th>
                <th className="px-3 py-2 text-right font-semibold w-24">
                  Status <SortBtn col="isActive" />
                </th>
                <th className="px-3 py-2 text-center font-semibold w-20">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                    Loading banners…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No banners found.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr key={row._id}
                      className={`transition-colors hover:bg-indigo-50/40 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                  >
                    {/* IMAGE — ✅ smaller thumbnail */}
                    <td className="px-3 py-1">
                      {row.imageUrl ? (
                        <img
                          src={row.imageUrl}
                          alt="Banner"
                          className="h-7 w-12 object-cover rounded border border-slate-200"
                        />
                      ) : (
                        <div className="h-7 w-12 bg-slate-100 rounded flex items-center justify-center">
                          <ImageIcon size={11} className="text-slate-400" />
                        </div>
                      )}
                    </td>

                    {/* TITLE */}
                    <td className="px-3 py-1">
                      {row.title ? (
                        <span className="text-slate-800 font-medium leading-snug">{row.title}</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* BUTTON */}
                    <td className="px-3 py-1">
                      {row.primaryLabel ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600
                                         font-medium bg-indigo-50 px-1.5 py-0.5 rounded">
                          <LinkIcon size={9} />
                          {row.primaryLabel}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* ORDER */}
                    <td className="px-3 py-1 text-right">
                      <span className="text-xs text-slate-500 tabular-nums font-medium">
                        {row.order ?? 0}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-1 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full
                                        text-[11px] font-semibold ${
                        row.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {row.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 py-1">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openModal(row)}
                          title="Edit"
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded
                                     hover:bg-indigo-50 border border-transparent
                                     hover:border-indigo-200 transition-all"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(row._id)}
                          title="Delete"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded
                                     hover:bg-rose-50 border border-transparent
                                     hover:border-rose-200 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* column search row */}
        <div className="border-t border-slate-100">
          <table className="w-full text-xs">
            <tbody>
              <tr>
                {(['Image', 'Title', 'Button', 'Order', 'Status', ''] as const).map((col, idx) => (
                  <td key={idx}
                      className={`px-3 py-1.5 ${
                        idx === 0 ? 'w-20' :
                        idx === 2 ? 'w-36' :
                        idx === 3 ? 'w-16' :
                        idx === 4 ? 'w-20' :
                        idx === 5 ? 'w-20' : ''
                      }`}
                  >
                    {col ? (
                      <div className="relative">
                        <input
                          placeholder={col}
                          className="w-full pl-2 pr-6 py-1 text-[11px] border border-slate-200
                                     rounded focus:outline-none focus:ring-1 focus:ring-indigo-300
                                     text-slate-600 placeholder-slate-400 bg-white"
                        />
                        <Search size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    ) : null}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MODAL — ✅ Compact form
      ═══════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                        bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md
                          flex flex-col max-h-[88vh] overflow-hidden">

            {/* Modal header */}
            <div className="px-4 py-3 border-b border-slate-100
                            flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Only the image is required. All other fields are optional.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="h-6 w-6 flex items-center justify-center rounded-full
                           hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition text-xs"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-4 space-y-3.5 overflow-y-auto flex-1">

                {/* ── Banner Image ── */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                    Banner Image{' '}
                    <span className="text-rose-500">*</span>{' '}
                    <span className="text-slate-400 font-normal">(JPG, PNG, WebP)</span>
                  </label>

                  <div className="flex items-center gap-3">
                    {/* Preview box — ✅ smaller */}
                    <div className="relative shrink-0">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-14 w-24 object-cover rounded-lg border border-slate-200"
                          />
                          <span className="absolute -top-1 -right-1 bg-emerald-500
                                           rounded-full p-0.5 shadow">
                            <CheckCircle2 size={10} className="text-white" />
                          </span>
                        </>
                      ) : (
                        <div className="h-14 w-24 bg-slate-50 rounded-lg border-2
                                        border-dashed border-slate-200 flex flex-col
                                        items-center justify-center gap-1">
                          <ImageIcon size={16} className="text-slate-300" />
                          <span className="text-[9px] text-slate-400">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Upload btn */}
                    <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white
                                      border border-slate-200 hover:border-indigo-300
                                      hover:bg-indigo-50 px-3 py-2 rounded-lg text-xs
                                      font-medium text-slate-600 hover:text-indigo-700
                                      transition shadow-sm">
                      {uploading ? (
                        <><Loader2 size={12} className="animate-spin text-indigo-500" /> Uploading…</>
                      ) : (
                        <><ImageIcon size={12} /> {imageUrl ? 'Change Image' : 'Upload Image'}</>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {uploadError && (
                    <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1">
                      <span className="inline-flex w-3.5 h-3.5 rounded-full bg-rose-100
                                       text-rose-500 text-[9px] items-center justify-center
                                       font-bold shrink-0">!</span>
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* ── Title ── */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Title <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    name="title"
                    placeholder="e.g. Let's Make Today Count"
                    defaultValue={editingBanner?.title || ''}
                    className={inputCls}
                  />
                </div>

                {/* ── Button label + link ── */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Button Label <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      name="primaryLabel"
                      placeholder="e.g. View Dashboard"
                      defaultValue={editingBanner?.primaryLabel || ''}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Button Link <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      name="primaryHref"
                      placeholder="e.g. /dashboard"
                      defaultValue={editingBanner?.primaryHref || ''}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* ── Status + Order ── */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="isActive"
                      defaultValue={editingBanner?.isActive === false ? 'false' : 'true'}
                      className={inputCls}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Display Order <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      name="order"
                      type="number"
                      min="0"
                      placeholder="0"
                      defaultValue={editingBanner?.order ?? 0}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60
                              flex items-center justify-between gap-3 shrink-0 rounded-b-xl">
                <div className="flex-1 min-w-0">
                  {saveError && (
                    <p className="text-[11px] text-rose-600 font-medium truncate">{saveError}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600
                               hover:bg-slate-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending || uploading}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs
                               font-semibold hover:bg-indigo-700 transition shadow-sm
                               disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {mutation.isPending && <Loader2 size={11} className="animate-spin" />}
                    {mutation.isPending ? 'Saving…' : 'Save Banner'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}