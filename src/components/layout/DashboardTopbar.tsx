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
        setCompanyName(res.data?.legalName || 'Company Profile Incomplete');
      } catch {
        setCompanyName('Company Name');
      }
    };
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get('/employees/current');
        if (res.data?.data) setCurrentUser(res.data.data);
      } catch {
        setCurrentUser(user);
      }
    };
    if (user?.tenantId && user.tenantId !== 'SUPER_ADMIN') {
      fetchProfile();
      fetchCurrentUser();
    }
  }, [user]);

  const displayUser = currentUser || user;
  const firstName = displayUser?.firstName || 'User';
  const initials = displayUser
    ? `${displayUser.firstName?.[0] || ''}${displayUser.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header
      className="h-12 flex items-center justify-between px-5 shrink-0"
      style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      {/* Left — company name */}
      <span className="text-sm font-semibold tracking-wide" style={{ color: '#e2e8f0' }}>
        {companyName}
      </span>

      {/* Right — greeting + avatar */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm font-medium" style={{ color: '#c7d2fe' }}>
          {getGreeting()},{' '}
          <span className="font-semibold" style={{ color: '#ffffff' }}>
            {firstName} 👋
          </span>
        </span>

        {displayUser?.profilePictureUrl ? (
          <img
            src={displayUser.profilePictureUrl}
            alt={firstName}
            className="h-7 w-7 rounded-full object-cover"
            style={{ border: '2px solid rgba(165,180,252,0.5)' }}
          />
        ) : (
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#ffffff',
              border: '2px solid rgba(165,180,252,0.4)',
            }}
          >
            {initials}
          </div>
        )}
      </div>
    </header>
  );
}