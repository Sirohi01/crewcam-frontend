'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Bell, HelpCircle, Mail, MessageSquare, FileText, Calendar, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DashboardTopbar() {
  const user = useAuthStore((state) => state.user);
  const [companyName, setCompanyName] = useState('Loading...');
  const [currentUser, setCurrentUser] = useState<any>(user);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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
          { icon: <MessageSquare size={16} />, badge: 5, href: '/dashboard/communications/chat' },
          { icon: <Bell size={16} />, badge: 1, isBell: true },
          { icon: <HelpCircle size={16} />, badge: 0, href: '/dashboard/support/faq' },
        ].map(({ icon, badge, href, isBell }, i) => {
          const content = (
            <>
              {icon}
              {badge > 0 && (
                <span
                  className="absolute top-1 right-1 h-3.5 min-w-[14px] rounded-full flex items-center justify-center text-[8px] font-bold leading-none px-0.5"
                  style={{ background: '#ef4444', color: '#fff' }}
                >
                  {badge}
                </span>
              )}
            </>
          );

          const className = "relative h-8 w-8 flex items-center justify-center rounded-lg transition-colors";
          const style = { color: '#a5b4fc' };
          const onMouseEnter = (e: any) => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)');
          const onMouseLeave = (e: any) => (e.currentTarget.style.background = 'transparent');

          if (isBell) {
            return (
              <div key={i} className="relative">
                <button
                  className={className}
                  style={style}
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {content}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 top-12 w-[380px] rounded-2xl bg-white shadow-xl border border-slate-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <button className="text-xs font-semibold text-[#0e4778] hover:underline">Mark all as read</button>
                    </div>
                    <div className="flex flex-col max-h-[400px] overflow-y-auto">
                      {[
                        { icon: <FileText size={16} />, title: 'New policy added', desc: 'Leave Policy 2026 has been added.', time: '2m ago', color: 'text-blue-600 bg-blue-50', unread: true },
                        { icon: <Calendar size={16} />, title: 'Interview scheduled', desc: 'Sohil Sirohi interview on 26 May.', time: '15m ago', color: 'text-emerald-600 bg-emerald-50', unread: true },
                        { icon: <Clock size={16} />, title: 'Attendance regularization', desc: '3 requests are pending approval.', time: '1h ago', color: 'text-orange-500 bg-orange-50', unread: true },
                        { icon: <FileText size={16} />, title: 'Payslip generated', desc: 'April 2026 payslip is ready.', time: '3h ago', color: 'text-indigo-600 bg-indigo-50', unread: false },
                        { icon: <RefreshCw size={16} />, title: 'System update', desc: 'CrewCam will be updated tonight.', time: '1d ago', color: 'text-slate-600 bg-slate-50', unread: false },
                      ].map((n, idx) => (
                        <div key={idx} className="flex gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.color}`}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                          </div>
                          <div className="flex flex-col items-end justify-start gap-1 shrink-0">
                            <span className="text-[10px] font-semibold text-slate-400">{n.time}</span>
                            {n.unread && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-slate-100 text-center">
                      <button className="text-sm font-bold text-[#0e4778] hover:underline">View all notifications</button>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          if (href) {
            return (
              <Link
                key={i}
                href={href}
                className={className}
                style={style}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={i}
              className={className}
              style={style}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {content}
            </button>
          );
        })}

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