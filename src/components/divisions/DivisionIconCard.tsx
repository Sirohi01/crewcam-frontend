'use client';

import React, { useRef } from 'react';
import { CloudUpload, Monitor, LayoutDashboard, Presentation, Users, Folder, Network } from 'lucide-react';
import { Card } from './FormHelpers';
import { toast } from 'react-hot-toast';

export function DivisionIconCard({ 
    title = "Division Icon", 
    entityName = "division",
    value,
    onChange
}: { 
    title?: string; 
    entityName?: string; 
    value?: string;
    onChange?: (val: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size should be 2MB or less');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (onChange && typeof reader.result === 'string') {
                onChange(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Card>
            <div className="mb-4">
                <h3 className="text-[13px] font-bold text-zinc-800">{title}</h3>
                <p className="text-[11px] text-zinc-500 mt-1">Upload an icon or choose from library to represent this {entityName}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload Icon Section */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border border-dashed rounded-lg flex flex-col items-center justify-center p-3 hover:bg-zinc-50 transition-colors cursor-pointer text-center h-full min-h-[100px] ${value && value.startsWith('data:image') ? 'border-blue-500 bg-blue-50/20' : 'border-zinc-200'}`}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg" 
                        onChange={handleFileChange} 
                    />
                    {value && value.startsWith('data:image') ? (
                        <img src={value} alt="Uploaded Icon" className="w-10 h-10 object-contain mb-1.5 rounded" />
                    ) : (
                        <CloudUpload size={20} className="text-zinc-400 mb-1.5" strokeWidth={1.5} />
                    )}
                    <span className="text-[11px] font-semibold text-indigo-600">
                        {value && value.startsWith('data:image') ? 'Change Icon' : 'Upload Icon'}
                    </span>
                    <span className="text-[9px] text-zinc-400 mt-1">PNG, JPG (Max 2MB)</span>
                </div>

                {/* Choose from Library Section */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-zinc-700 text-center mb-1.5 block">Choose from Library</span>
                    <div className="grid grid-cols-3 gap-1.5 flex-1">
                        {[
                            { id: 'monitor', icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-50/50', border: 'hover:border-blue-100', activeBg: 'bg-blue-100 border-blue-500' },
                            { id: 'layout', icon: LayoutDashboard, color: 'text-emerald-500', bg: 'bg-emerald-50/50', border: 'hover:border-emerald-100', activeBg: 'bg-emerald-100 border-emerald-500' },
                            { id: 'presentation', icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50/50', border: 'hover:border-orange-100', activeBg: 'bg-orange-100 border-orange-500' },
                            { id: 'users', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50/50', border: 'hover:border-purple-100', activeBg: 'bg-purple-100 border-purple-500' },
                            { id: 'folder', icon: Folder, color: 'text-pink-500', bg: 'bg-pink-50/50', border: 'hover:border-pink-100', activeBg: 'bg-pink-100 border-pink-500' },
                            { id: 'network', icon: Network, color: 'text-teal-500', bg: 'bg-teal-50/50', border: 'hover:border-teal-100', activeBg: 'bg-teal-100 border-teal-500' },
                        ].map(item => (
                            <div 
                                key={item.id}
                                onClick={() => onChange?.(item.id)}
                                className={`rounded-lg flex items-center justify-center cursor-pointer transition-colors border aspect-square ${value === item.id ? item.activeBg : `${item.bg} border-transparent ${item.border}`}`}
                            >
                                <item.icon size={16} className={item.color} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
