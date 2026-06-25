'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import api from '@/lib/axios';

export default function BannersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // Separate state for the image URL — avoids the null-spread bug when creating new banners
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
      console.error('Save error:', msg);
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

    // Build FormData — must NOT set Content-Type manually; browser sets boundary automatically
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
      console.error('Upload failed:', err?.response?.data || err.message);
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

    const formData = new FormData(e.target as HTMLFormElement);
    mutation.mutate({
      tag: (formData.get('tag') as string) || '',
      title: (formData.get('title') as string) || '',
      subtitle: (formData.get('subtitle') as string) || '',
      primaryLabel: (formData.get('primaryLabel') as string) || '',
      primaryHref: (formData.get('primaryHref') as string) || '',
      secondaryLabel: (formData.get('secondaryLabel') as string) || '',
      secondaryHref: (formData.get('secondaryHref') as string) || '',
      imageUrl,
      isActive: formData.get('isActive') === 'true',
      order: Number(formData.get('order') || 0),
    });
  };

  const columns = [
    {
      key: 'image',
      label: 'IMAGE',
      width: '90px',
      render: (_: any, row: any) =>
        row.imageUrl ? (
          <img src={row.imageUrl} className="h-10 w-16 object-cover rounded" alt="Banner" />
        ) : (
          <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center">
            <ImageIcon size={16} className="text-slate-400" />
          </div>
        ),
    },
    { key: 'tag', label: 'TAG', width: '160px' },
    { key: 'title', label: 'TITLE' },
    {
      key: 'isActive',
      label: 'STATUS',
      width: '90px',
      render: (_: any, row: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '80px',
      render: (_: any, row: any) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openModal(row)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => deleteMutation.mutate(row._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Banners</h1>
          <p className="text-sm text-slate-500">Manage the hero slides shown on the tenant dashboard.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <DataTable columns={columns} data={banners || []} loading={isLoading} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-base font-bold text-slate-800">
                {editingBanner ? 'Edit Banner' : 'New Banner'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-5 space-y-3 overflow-y-auto flex-1">

                {/* Image Upload — MANDATORY */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Banner Image <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {imageUrl ? (
                      <div className="relative">
                        <img src={imageUrl} alt="Preview" className="h-16 w-24 object-cover rounded-lg border border-slate-200" />
                        <div className="absolute -top-1.5 -right-1.5 bg-green-500 rounded-full p-0.5">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 w-24 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                        <ImageIcon size={20} className="text-slate-400" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 border border-slate-200">
                      {uploading ? (
                        <><Loader2 size={14} className="animate-spin" /> Uploading...</>
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
                    <p className="mt-1 text-xs text-rose-500">{uploadError}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
                  <input
                    name="title"
                    defaultValue={editingBanner?.title}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                {/* Buttons */}

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Secondary Button Label</label>
                    <input
                      name="secondaryLabel"
                      defaultValue={editingBanner?.secondaryLabel}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Secondary Button Link</label>
                    <input
                      name="secondaryHref"
                      defaultValue={editingBanner?.secondaryHref}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                      <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    name="isActive"
                    defaultValue={editingBanner?.isActive === false ? 'false' : 'true'}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t bg-slate-50 flex items-center justify-between gap-3 shrink-0">
                <div className="flex-1">
                  {saveError && (
                    <p className="text-xs text-rose-600 font-medium">{saveError}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mutation.isPending || uploading}
                    className="px-6 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {mutation.isPending && <Loader2 size={13} className="animate-spin" />}
                    {mutation.isPending ? 'Saving...' : 'Save Banner'}
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
