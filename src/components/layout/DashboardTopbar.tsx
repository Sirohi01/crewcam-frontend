'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Bell, HelpCircle, Mail, MessageSquare } from 'lucide-react';

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
      {/* Left — company name as text */}
      <span className="text-sm font-semibold tracking-wide" style={{ color: '#e2e8f0' }}>
        {companyName}
      </span>

      {/* Right — icons + greeting + avatar */}
      <div className="flex items-center gap-1">

        {/* 4 icon buttons */}
        {[
          // { icon: <Mail size={16} />, badge: 3 },
          { icon: <MessageSquare size={16} />, badge: 5 },
          { icon: <Bell size={16} />, badge: 1 },
          { icon: <HelpCircle size={16} />, badge: 0 },
        ].map(({ icon, badge }, i) => (
          <button
            key={i}
            className="relative h-8 w-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#a5b4fc' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {icon}
            {badge > 0 && (
              <span
                className="absolute top-1 right-1 h-3.5 min-w-[14px] rounded-full flex items-center justify-center text-[8px] font-bold leading-none px-0.5"
                style={{ background: '#ef4444', color: '#fff' }}
              >
                {badge}
              </span>
            )}
          </button>
        ))}

        {/* Divider */}
        <div className="mx-2 h-5 w-px" style={{ background: 'rgba(99,102,241,0.3)' }} />

        {/* Greeting */}
        <span className="hidden sm:block text-sm font-medium mr-2" style={{ color: '#c7d2fe' }}>
          {getGreeting()},{' '}
          <span className="font-semibold" style={{ color: '#ffffff' }}>
            {firstName} 👋
          </span>
        </span>

        {/* Avatar */}
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