'use client';

import React, { useState } from 'react';
import {
  Shield,
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  LogOut,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HelpCircle,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';

export default function SessionTimeoutSettings() {
  const [isTimeoutEnabled, setIsTimeoutEnabled] = useState(true);
  const [idleDuration, setIdleDuration] = useState('30 Minutes');
  const [warningBefore, setWarningBefore] = useState('5 Minutes');
  const [autoLogout, setAutoLogout] = useState('Yes');
  const [maxSession, setMaxSession] = useState('8 Hours');
  const [timeoutBehavior, setTimeoutBehavior] = useState('automatic');
  const [activities, setActivities] = useState({
    mouse: true,
    keyboard: true,
    page: true,
    data: true,
    file: true,
    api: true
  });

  const tabs = [
    'Access Overview',
    'Access Granted',
    'Credentials & Instructions',
    'Data Access Scope',
    'Terms & Conditions',
    'Activity Log',
    'Active Access',
    'Session Timeout',
    'Notifications'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-2 font-sans text-slate-800">
      <div className="mx-auto w-full p-2 space-y-4">

        {/* Breadcrumb */}
        <div className="text-xs text-blue-600 font-medium mb-2 flex items-center gap-1.5 flex-wrap">
          <span>Home</span>
          <span className="text-slate-400">›</span>
          <span>Technical Access Management</span>
          <span className="text-slate-400">›</span>
          <span>Request Details</span>
          <span className="text-slate-400">›</span>
          <span>Access Details</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-800">Session Timeout Settings</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-blue-600 h-7 w-7" />
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Session Timeout Settings</h1>
            </div>
            <p className="text-slate-500 text-sm">
              Configure idle timeouts and automatic logout settings for this technical access.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Active Access
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* Request ID */}
            <div className="p-2 flex gap-3">
              <div className="bg-blue-50 text-blue-600 rounded-lg p-2.5 h-fit mt-1 border border-blue-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Request ID</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-slate-900 font-bold text-[15px]">TAR-2025-028</p>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-100">Active</span>
                </div>
                <p className="text-xs text-slate-500">Requested on 30 May 2025, 11:20 AM</p>
              </div>
            </div>

            {/* Company */}
            <div className="p-2 flex gap-3">
              <div className="bg-blue-600 text-white rounded-lg p-2.5 h-fit mt-1 shadow-sm flex items-center justify-center">
                <span className="font-bold text-sm leading-none block">T</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Company</p>
                <p className="text-slate-900 font-semibold text-[15px]">TechVision Pvt. Ltd.</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="p-2 flex flex-col justify-center">
              <p className="text-xs text-slate-500 font-medium mb-1">Purpose</p>
              <p className="text-slate-900 font-semibold text-[15px] mb-1">System Maintenance</p>
              <p className="text-xs text-slate-500">Server optimization</p>
            </div>

            {/* Access Type */}
            <div className="p-2 flex flex-col justify-center">
              <p className="text-xs text-slate-500 font-medium mb-2">Access Type</p>
              <div>
                <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-md font-medium border border-purple-100 inline-block">
                  Time-Bound Access
                </span>
              </div>
            </div>

            {/* Access Duration */}
            <div className="p-4 flex gap-3">
              <div className="bg-emerald-50 text-emerald-600 rounded-lg p-2.5 h-fit mt-1 border border-emerald-100">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Access Duration</p>
                <p className="text-slate-900 font-semibold text-[13px]">30 May 2025, 02:35 PM</p>
                <p className="text-[11px] text-slate-400 my-0.5">to</p>
                <p className="text-slate-900 font-semibold text-[13px] flex items-center gap-1">
                  02 Jun 2025, 06:00 PM
                  <span className="text-[11px] text-slate-500 font-normal">(3 Days)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-8 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${tab === 'Session Timeout'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">

          {/* Left Column (70%) */}
          <div className="lg:col-span-8 space-y-2">

            {/* Configure Session Timeout Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Configure Session Timeout</h2>
              <p className="text-sm text-slate-500 mb-4">Set idle time limits and automatic logout preferences to maintain system security.</p>

              <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-2">

                {/* Toggle */}
                <div className="flex items-start gap-4 mb-4">
                  <button
                    onClick={() => setIsTimeoutEnabled(!isTimeoutEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isTimeoutEnabled ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isTimeoutEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Enable Session Timeout</p>
                    <p className="text-sm text-slate-500">Automatically log out users after a period of inactivity.</p>
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">
                      Idle Timeout Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={idleDuration}
                        onChange={(e) => setIdleDuration(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option>30 Minutes</option>
                        <option>1 Hour</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">
                      Warning Before Logout <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={warningBefore}
                        onChange={(e) => setWarningBefore(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option>5 Minutes</option>
                        <option>10 Minutes</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">
                      Auto Logout After Warning <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={autoLogout}
                        onChange={(e) => setAutoLogout(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-2">
                      Max Session Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={maxSession}
                        onChange={(e) => setMaxSession(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option>8 Hours</option>
                        <option>12 Hours</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeout Behavior Settings */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Timeout Behavior Settings</h3>
              <p className="text-sm text-slate-500 mb-4">Define what happens when a user session times out.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Card 1 */}
                <button
                  onClick={() => setTimeoutBehavior('automatic')}
                  className={`text-left p-2 rounded-xl border transition-all relative shadow-sm ${timeoutBehavior === 'automatic'
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center h-4 w-4 rounded-full border ${timeoutBehavior === 'automatic' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {timeoutBehavior === 'automatic' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-semibold text-sm text-slate-900">Automatic Logout</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-7 mb-3 leading-relaxed">User will be automatically logged out after the idle timeout.</p>
                  <div className="ml-7 text-blue-600 bg-blue-50 h-8 w-8 rounded flex items-center justify-center border border-blue-100">
                    <LogOut className="h-4 w-4" />
                  </div>
                </button>

                {/* Card 2 */}
                <button
                  onClick={() => setTimeoutBehavior('warn-logout')}
                  className={`text-left p-2 rounded-xl border transition-all relative shadow-sm ${timeoutBehavior === 'warn-logout'
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center h-4 w-4 rounded-full border ${timeoutBehavior === 'warn-logout' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {timeoutBehavior === 'warn-logout' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-semibold text-sm text-slate-900">Warn and Logout</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-7 mb-3 leading-relaxed">User will see a warning and then logged out after the warning period.</p>
                  <div className="ml-7 text-amber-500 bg-amber-50 h-8 w-8 rounded flex items-center justify-center border border-amber-100">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                </button>

                {/* Card 3 */}
                <button
                  onClick={() => setTimeoutBehavior('warn-extend')}
                  className={`text-left p-2 rounded-xl border transition-all relative shadow-sm ${timeoutBehavior === 'warn-extend'
                    ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center h-4 w-4 rounded-full border ${timeoutBehavior === 'warn-extend' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {timeoutBehavior === 'warn-extend' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="font-semibold text-sm text-slate-900">Warn and Extend</span>
                  </div>
                  <p className="text-xs text-slate-500 ml-7 mb-3 leading-relaxed">User can extend the session when a warning is shown.</p>
                  <div className="ml-7 text-emerald-500 bg-emerald-50 h-8 w-8 rounded flex items-center justify-center border border-emerald-100">
                    <Clock className="h-4 w-4" />
                  </div>
                </button>

              </div>
            </div>

            {/* Idle Activity Detection */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Idle Activity Detection</h3>
              <p className="text-sm text-slate-500 mb-4">Configure which activities reset the idle timer.</p>

              <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.mouse && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">Mouse Movement</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.data && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">Data Entry / Form Submission</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.keyboard && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">Keyboard Activity</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.file && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">File Download / Upload</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.page && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">Page Navigation</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="h-5 w-5 rounded bg-blue-600 text-white flex items-center justify-center border border-blue-600 shadow-sm">
                      {activities.api && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-slate-800">API / System Requests</span>
                  </label>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-800 text-sm shadow-sm">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p>Any of the selected activities will reset the idle timer.</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Active Access
              </button>
              <div className="flex flex-col sm:items-end gap-2">
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                  <CheckCircle2 className="h-4 w-4" />
                  Save Timeout Settings
                </button>
                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium mr-1">
                  <span>All changes are autosaved</span>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-4 space-y-4">

            {/* Timeout Policy Summary Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Timeout Policy Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Idle Timeout Duration</span>
                  </div>
                  <span className="font-semibold text-slate-900">30 Minutes</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <AlertTriangle className="h-4 w-4 text-blue-500" />
                    <span>Warning Before Logout</span>
                  </div>
                  <span className="font-semibold text-slate-900">5 Minutes</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Auto Logout After Warning</span>
                  </div>
                  <span className="font-semibold text-slate-900">Yes</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Max Session Duration</span>
                  </div>
                  <span className="font-semibold text-slate-900">8 Hours</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <LogOut className="h-4 w-4 text-blue-500" />
                    <span>Behavior on Timeout</span>
                  </div>
                  <span className="font-semibold text-slate-900">Automatic Logout</span>
                </div>

                <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Status</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-100">Active</span>
                </div>
              </div>
            </div>

            {/* Session Example Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Session Example</h3>
              <p className="text-xs text-slate-500 mb-4">Here's how the timeout will work:</p>

              <div className="relative pl-6 border-l border-slate-200 ml-3 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">0 min</p>
                  <p className="text-xs text-slate-500 mt-0.5">User is active in the system</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">25 min</p>
                  <p className="text-xs text-slate-500 mt-0.5">Warning message will be shown</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                    <LogOut className="h-4 w-4 text-rose-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">30 min</p>
                  <p className="text-xs text-slate-500 mt-0.5">User will be automatically logged out</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-6 w-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                    <Calendar className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">8 hours</p>
                  <p className="text-xs text-slate-500 mt-0.5">Maximum session duration reached</p>
                </div>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Need Help?</h3>
              <div className="flex gap-3 mb-4">
                <div className="text-blue-500 bg-blue-50 p-2 rounded-lg shrink-0 h-fit border border-blue-100">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  Learn more about session timeout policies and best practices.
                </p>
              </div>
              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors ml-11">
                View Help Articles →
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex-1" />
          <p className="text-center font-medium">© 2025 Crewcam HRMS. All Rights Reserved.</p>
          <div className="flex-1 flex justify-end gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}
