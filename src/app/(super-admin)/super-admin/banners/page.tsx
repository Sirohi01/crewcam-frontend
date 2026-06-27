'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/axios';

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const { data: banners, isLoading } = useQuery({
    queryKey: ['super-admin', 'banners'],
    queryFn: async () => (await api.get('/super-admin/banners')).data,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingBanner?._id) {
        return api.put(`/super-admin/banners/${editingBanner._id}`, payload);
      }
      return api.post('/super-admin/banners', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'banners'] });
      closeModal();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      setSaveError(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/super-admin/banners/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['super-admin', 'banners'] }),
  });

  const openModal = (banner?: any) => {
    setEditingBanner(banner || null);
    setImageUrl(banner?.imageUrl || '');
    setUploadError('');
    setSaveError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setImageUrl('');
    setUploadError('');
    setSaveError('');
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setUploadError('Please upload a banner image before saving.');
      return;
    }
    const fd = new FormData(e.target as HTMLFormElement);
    mutation.mutate({
      imageUrl,
      title:          (fd.get('title') as string)         || '',
      primaryLabel:   (fd.get('primaryLabel') as string)  || '',
      primaryHref:    (fd.get('primaryHref') as string)   || '',
      isActive:       fd.get('isActive') === 'true',
      order:          Number(fd.get('order') || 0),
      // keep unused fields as empty strings so backend is happy
      tag: '', subtitle: '', secondaryLabel: '', secondaryHref: '',
    });
  };

  /* ── table columns ── */
  const columns = [
    {
      key: 'image',
      label: 'IMAGE',
      width: '100px',
      render: (_: any, row: any) =>
        row.imageUrl ? (
          <img src={row.imageUrl} className="h-10 w-20 object-cover rounded-lg" alt="Banner" />
        ) : (
          <div className="h-10 w-20 bg-slate-100 rounded-lg flex items-center justify-center">
            <ImageIcon size={16} className="text-slate-400" />
          </div>
        ),
    },
    { key: 'title', label: 'TITLE' },
    {
      key: 'primaryLabel',
      label: 'BUTTON',
      width: '160px',
      render: (_: any, row: any) =>
        row.primaryLabel ? (
          <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
            <LinkIcon size={11} /> {row.primaryLabel}
          </span>
        ) : (
          <span className="text-xs text-slate-300">—</span>
        ),
    },
    {
      key: 'order',
      label: 'ORDER',
      width: '70px',
      render: (_: any, row: any) => (
        <span className="text-xs text-slate-500 tabular-nums">{row.order ?? 0}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'STATUS',
      width: '90px',
      render: (_: any, row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '80px',
      render: (_: any, row: any) => (
        <div className="flex justify-end gap-1">
          <button onClick={() => openModal(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => deleteMutation.mutate(row._id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  /* ── input class helper ── */
  const inputCls = 'w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition';

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Banners</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage the hero slides shown on every tenant's dashboard.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={15} /> Add Banner
        </button>
      </div>

      <DataTable columns={columns} data={banners || []} loading={isLoading} />

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Only the image is required. All other fields are optional.</p>
              </div>
              <button
                onClick={closeModal}
                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition text-base leading-none"
              >
                ✕
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">

                {/* ── 1. Banner Image (MANDATORY) ── */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Banner Image <span className="text-rose-500 ml-0.5">*</span>
                    <span className="text-slate-400 font-normal ml-1">(JPG, PNG, WebP)</span>
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="relative shrink-0">
                      {imageUrl ? (
                        <>
                          <img
                            src={imageUrl}
                            alt="Banner preview"
                            className="h-20 w-32 object-cover rounded-xl border border-slate-200 shadow-sm"
                          />
                          <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 rounded-full p-0.5 shadow">
                            <CheckCircle2 size={12} className="text-white" />
                          </span>
                        </>
                      ) : (
                        <div className="h-20 w-32 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1">
                          <ImageIcon size={22} className="text-slate-300" />
                          <span className="text-[10px] text-slate-400">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Upload button */}
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-700 transition shadow-sm">
                      {uploading ? (
                        <><Loader2 size={14} className="animate-spin text-indigo-500" /> Uploading…</>
                      ) : (
                        <><ImageIcon size={14} /> {imageUrl ? 'Change Image' : 'Upload Image'}</>
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
                    <p className="mt-2 text-xs text-rose-500 flex items-center gap-1">
                      <span className="inline-block w-3.5 h-3.5 rounded-full bg-rose-100 text-rose-500 text-[9px] flex items-center justify-center font-bold">!</span>
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* ── 2. Title (optional) ── */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Title
                    <span className="text-slate-400 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    name="title"
                    placeholder="e.g. Let's Make Today Count"
                    defaultValue={editingBanner?.title || ''}
                    className={inputCls}
                  />
                </div>

                {/* ── 3. Button label + link (optional) ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Button Label
                      <span className="text-slate-400 font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      name="primaryLabel"
                      placeholder="e.g. View Dashboard"
                      defaultValue={editingBanner?.primaryLabel || ''}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Button Link
                      <span className="text-slate-400 font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      name="primaryHref"
                      placeholder="e.g. /dashboard"
                      defaultValue={editingBanner?.primaryHref || ''}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* ── 4. Status + Order (optional) ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Display Order
                      <span className="text-slate-400 font-normal ml-1">(optional)</span>
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
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 shrink-0 rounded-b-2xl">
                <div className="flex-1 min-w-0">
                  {saveError && (
                    <p className="text-xs text-rose-600 font-medium truncate">{saveError}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending || uploading}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {mutation.isPending && <Loader2 size={13} className="animate-spin" />}
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
