'use client';

import React from 'react';
import {
  Building2,
  Globe,
  Clock,
  Calendar,
} from 'lucide-react';
import { FaBuildingCircleCheck, FaHashtag } from 'react-icons/fa6';
import { HiOutlineIdentification } from 'react-icons/hi2';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { CompanyProfile } from '@/services/companyService';

interface KeyInfoItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface CompanyProfileKeyInfoProps {
  company: CompanyProfile;
}

export function CompanyProfileKeyInfo({ company }: CompanyProfileKeyInfoProps) {
  const keyInfo: KeyInfoItem[] = [
    { label: 'Company Name', value: company.legalName || company.name, icon: <Building2 className="h-4 w-4" /> },
    { label: 'Company Code', value: company.companyCode || 'N/A', icon: <FaHashtag className="h-3.5 w-3.5" /> },
    { label: 'Business Type', value: company.businessType || 'N/A', icon: <FaBuildingCircleCheck className="h-4 w-4" /> },
    { label: 'Industry', value: company.industry || 'N/A', icon: <Globe className="h-4 w-4" /> },
    { label: 'PAN Number', value: company.panNumber || 'N/A', icon: <HiOutlineIdentification className="h-4 w-4" /> },
    { label: 'GST Number', value: company.gstNumber || 'N/A', icon: <LiaFileInvoiceDollarSolid className="h-4 w-4" /> },
    { label: 'Website', value: company.website || 'N/A', icon: <Globe className="h-4 w-4" /> },
    { label: 'Years in Business', value: company.establishedDate ? `${new Date().getFullYear() - new Date(company.establishedDate).getFullYear()}+ Years` : 'N/A', icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-2">
      {keyInfo.map((item) => (
        <div key={item.label} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-blue-700">{item.icon}</span>
            {item.label}
          </div>
          <div className="text-left font-medium text-slate-900">{item.value}</div>
        </div>
      ))}
    </div>
  );
}