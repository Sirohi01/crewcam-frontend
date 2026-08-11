'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { useCandidate } from '../layout';
import { Button } from '@/components/ui/button';

export default function ResumeDocumentsTab() {
  const { candidate } = useCandidate();

  if (!candidate) return null;

  return (
    <div className="xl:col-span-12 flex flex-col gap-3 h-full">
      <Card className="border-zinc-200/80 shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl flex flex-row items-center justify-between shrink-0">
          <div>
            <CardTitle className="text-[15px] font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" /> Resume & Documents
            </CardTitle>
            <p className="text-[12px] font-medium text-zinc-500 mt-1">Review the candidate's uploaded resume.</p>
          </div>
          {candidate.resumeUrl && (
            <Button variant="outline" className="h-8 px-3 text-[11px] font-bold" onClick={() => window.open(candidate.resumeUrl, '_blank')}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-[600px] bg-zinc-100/50">
          {candidate.resumeUrl ? (
            <iframe 
              src={`${candidate.resumeUrl}#toolbar=0`} 
              className="w-full h-full border-0 rounded-b-xl min-h-[600px]" 
              title="Candidate Resume"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900 mb-1">No Resume Available</h3>
              <p className="text-[12px] font-medium text-zinc-500 max-w-md mx-auto">This candidate hasn't uploaded a resume document or the file could not be loaded.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
