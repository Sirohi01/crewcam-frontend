'use client';

import React from 'react';
import { CloudUpload, Monitor, LayoutDashboard, Presentation, Users, Folder, Network } from 'lucide-react';
import { Card } from './FormHelpers';

export function DivisionIconCard() {
    return (
        <Card>
            <div className="mb-4">
                <h3 className="text-[13px] font-bold text-zinc-800">Division Icon</h3>
                <p className="text-[11px] text-zinc-500 mt-1">Upload an icon or choose from library to represent this division.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Upload Icon Section */}
                <div className="border border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center p-3 hover:bg-zinc-50 transition-colors cursor-pointer text-center h-full min-h-[100px]">
                    <CloudUpload size={20} className="text-zinc-400 mb-1.5" strokeWidth={1.5} />
                    <span className="text-[11px] font-semibold text-indigo-600">Upload Icon</span>
                    <span className="text-[9px] text-zinc-400 mt-1">PNG, JPG (Max 2MB)</span>
                </div>

                {/* Choose from Library Section */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-zinc-700 text-center mb-1.5 block">Choose from Library</span>
                    <div className="grid grid-cols-3 gap-1.5 flex-1">
                        <div className="bg-blue-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 aspect-square">
                            <Monitor size={16} className="text-blue-500" />
                        </div>
                        <div className="bg-emerald-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100 aspect-square">
                            <LayoutDashboard size={16} className="text-emerald-500" />
                        </div>
                        <div className="bg-orange-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100 aspect-square">
                            <Presentation size={16} className="text-orange-500" />
                        </div>
                        <div className="bg-purple-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100 aspect-square">
                            <Users size={16} className="text-purple-500" />
                        </div>
                        <div className="bg-pink-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-pink-50 transition-colors border border-transparent hover:border-pink-100 aspect-square">
                            <Folder size={16} className="text-pink-500" />
                        </div>
                        <div className="bg-teal-50/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-100 aspect-square">
                            <Network size={16} className="text-teal-500" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
