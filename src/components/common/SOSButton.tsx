'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LifeBuoy, X, Image as ImageIcon, Download, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { uploadFile } from '@/services/uploadService';
import { PlatformIssueType, sendPlatformReport } from '@/services/platformReportService';

export default function SOSButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  
  const [issueType, setIssueType] = useState<PlatformIssueType>('bug');
  const [description, setDescription] = useState('');
  // The screen may show salary or personal data, so attaching it is the reporter's choice.
  const [attachScreenshot, setAttachScreenshot] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const captureScreen = async () => {
    setIsCapturing(true);
    try {
      // Temporarily hide the SOS button from the screenshot
      const sosBtn = document.getElementById('sos-floating-button');
      if (sosBtn) sosBtn.style.visibility = 'hidden';

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      if (sosBtn) sosBtn.style.visibility = 'visible';
      
      // JPEG keeps full-page captures well under the 5 MB upload limit.
      const image = canvas.toDataURL('image/jpeg', 0.75);
      setScreenshot(image);
      setIsOpen(true);
    } catch (error) {
      console.error('Screenshot capture failed', error);
      alert('Failed to capture screen. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!screenshot) return;
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `crewcam-report-${new Date().getTime()}.jpg`;
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      let screenshotUrl: string | undefined;
      if (attachScreenshot && screenshot) {
        const blob = await (await fetch(screenshot)).blob();
        screenshotUrl = await uploadFile(blob, 'screenshot.jpg');
      }
      const res = await sendPlatformReport({ issueType, description: description.trim(), pageUrl: pathname || undefined, screenshotUrl });
      setReference(res.ticket?.ticketNumber || '');
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not send your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setScreenshot(null);
      setIsSuccess(false);
      setDescription('');
      setIssueType('bug');
      setAttachScreenshot(true);
      setError('');
      setReference('');
    }, 300);
  };

  // The dedicated Emergency page has its own "Trigger Emergency Alert" CTA,
  // so the floating bug-report SOS button would be a confusing duplicate there.
  if (pathname?.startsWith('/dashboard/employee/emergency')) return null;

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-[100] group print:hidden">
        <button
          id="sos-floating-button"
          onClick={captureScreen}
          disabled={isCapturing}
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-md border border-red-600 transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 disabled:opacity-70"
          title="Report an Issue"
        >
          {isCapturing ? (
            <Loader2 className="animate-spin text-white" size={20} />
          ) : (
            <LifeBuoy size={22} strokeWidth={2} />
          )}
          
          {/* Tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100 pointer-events-none">
            Report Issue
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800"></div>
          </div>
        </button>
      </div>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3 text-red-500">
                <LifeBuoy size={24} strokeWidth={2.5} />
                <h2 className="text-lg font-bold text-slate-800">Report a Problem</h2>
              </div>
              <button 
                onClick={closeModal}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full max-h-[75vh] overflow-hidden">
              
              {/* Left Side - Form */}
              <div className="flex-1 overflow-y-auto p-6 md:border-r border-slate-100">
                {isSuccess ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500">
                      <CheckCircle2 size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Issue Reported!</h3>
                    <p className="text-sm text-slate-500 px-4">
                      Thanks — the CrewCam team has your report{reference ? ` (${reference})` : ''}. You&apos;ll get a notification when they respond, and you can track it under Helpdesk → My Tickets.
                    </p>
                    <button type="button" onClick={closeModal} className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {/* Issue Type */}
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                        <AlertCircle size={16} className="text-slate-400" />
                        Issue Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['bug', 'question', 'feedback'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setIssueType(type)}
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-all ${
                              issueType === type 
                                ? 'border-[#0e4778] bg-blue-50 text-[#0e4778]' 
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-800">
                        Description
                      </label>
                      <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe what went wrong or what you were trying to do..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#0e4778] focus:bg-white focus:ring-1 focus:ring-[#0e4778]"
                        rows={5}
                      />
                    </div>

                    <label className="flex items-start gap-2 text-xs text-slate-600">
                      <input type="checkbox" checked={attachScreenshot} onChange={(e) => setAttachScreenshot(e.target.checked)} className="mt-0.5" />
                      Attach the captured screen. Untick it if the screen shows salary or other personal details.
                    </label>

                    {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !description.trim()}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e4778] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} /> Submit Report
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-xs text-slate-500">
                      Your report{attachScreenshot ? ', the screenshot' : ''} and the page you were on go to the CrewCam support team — not your company&apos;s helpdesk.
                    </p>
                  </form>
                )}
              </div>

              {/* Right Side - Screenshot Preview */}
              <div className="flex w-full flex-col bg-slate-50 p-6 md:w-[45%] shrink-0">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <ImageIcon size={16} className="text-slate-400" />
                    Captured Screen
                  </h3>
                  <button 
                    onClick={handleDownload}
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
                
                <div className="relative flex-1 overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm group">
                  {screenshot && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={screenshot} 
                      alt="Screen Capture" 
                      className="h-full w-full object-contain"
                    />
                  )}
                  {/* Hover overlay for download */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-lg hover:scale-105 transition-transform"
                    >
                      <Download size={16} /> Save Image
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
