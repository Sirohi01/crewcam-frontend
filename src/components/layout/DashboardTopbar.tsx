'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

export default function DashboardTopbar() {
  const user = useAuthStore((state) => state.user);
  const [companyName, setCompanyName] = useState('Loading...');
  const [currentUser, setCurrentUser] = useState<any>(user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/companies/profile');
        if (res.data?.legalName) {
          setCompanyName(res.data.legalName);
        } else {
          setCompanyName('Company Profile Incomplete');
        }
      } catch (error) {
        console.error('Failed to fetch company profile for topbar', error);
        setCompanyName('Company Name');
      }
    };
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get('/employees/current');
        if (res.data?.data) setCurrentUser(res.data.data);
      } catch (error) {
        setCurrentUser(user);
      }
    };
    if (user?.tenantId && user.tenantId !== 'SUPER_ADMIN') {
      fetchProfile();
      fetchCurrentUser();
    }
  }, [user]);

  const displayUser = currentUser || user;
  const initials = displayUser ? `${displayUser.firstName?.[0] || ''}${displayUser.lastName?.[0] || ''}`.toUpperCase() : 'U';

  return (
    <header className="h-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-md font-semibold text-zinc-900 dark:text-zinc-50">{companyName}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-md text-zinc-900 dark:text-zinc-100 leading-none">{displayUser?.firstName} {displayUser?.lastName}</div>
          <div className="mt-1 text-[10px] text-zinc-500 leading-none">{displayUser?.email}</div>
        </div>
        {displayUser?.profilePictureUrl ? (
          <img
            src={displayUser.profilePictureUrl}
            alt={`${displayUser.firstName || 'User'} ${displayUser.lastName || ''}`}
            className="h-7 w-7 rounded-full object-cover border border-zinc-200 bg-zinc-100"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-md text-zinc-700 dark:text-zinc-300">
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}
