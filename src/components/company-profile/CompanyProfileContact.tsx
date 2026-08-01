'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CompanyProfile } from '@/services/companyService';

interface CompanyProfileContactProps {
  company: CompanyProfile;
}

export function CompanyProfileContact({ company }: CompanyProfileContactProps) {
  const address = company.address;
  const contact = company.contact;

  const mapQuery = [address?.registeredOffice, address?.city, address?.state, address?.pincode, address?.country]
    .filter(Boolean)
    .join(', ');
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  return (
    <div className="space-y-4 flex space-x-2">
      <div className="space-y-4 text-xs flex-1">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <div>
            <div className="font-medium text-slate-900">Registered Office</div>
            <div className="text-slate-500 line-clamp-2">
              {address?.registeredOffice || 'N/A'}, {address?.city || ''}, {address?.state || ''} - {address?.pincode || ''}, {address?.country || ''}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <div>
            <div className="font-medium text-slate-900">Phone Number</div>
            <div className="text-slate-500">{contact?.phone || 'N/A'}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <div>
            <div className="font-medium text-slate-900">Email Address</div>
            <div className="text-slate-500">{contact?.email || 'N/A'}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
          <div>
            <div className="font-medium text-slate-900">HR Email</div>
            <div className="text-slate-500">{contact?.hrEmail || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 mt-4 h-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 lg:mt-0 lg:h-auto">
        {mapQuery ? (
          <iframe
            src={mapSrc}
            title={`Map of ${mapQuery}`}
            loading="lazy"
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full min-h-32 items-center justify-center text-xs text-slate-400">
            Map not available
          </div>
        )}
      </div>
    </div>
  );
}