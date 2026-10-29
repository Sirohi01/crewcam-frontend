'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Loader2 } from 'lucide-react';
import { useCandidate } from '../layout';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

/** Extension from the URL's path, ignoring any query string/hash (Cloudinary URLs carry one). */
const getExtension = (url: string): string => {
  const clean = url.split('?')[0].split('#')[0];
  const match = clean.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : '';
};

const OFFICE_EXTENSIONS = new Set(['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']);

// Some uploads (e.g. a candidate's own original filename getting sanitized before reaching
// Cloudinary) end up stored with no file extension in the URL at all. The server's Content-Type
// turned out to be unreliable too — Cloudinary's "raw" resource delivery doesn't report the
// specific Office MIME type, just a generic one. The file's own magic bytes are the one thing
// that's always correct, so that's the primary signal now (MIME_TO_EXT stays as a secondary
// fallback for file types sniffing doesn't distinguish, like images).
const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

/** Reads a blob's first bytes and matches them against known file "magic number" signatures —
 * this is what a file actually is, independent of its URL or whatever Content-Type the server
 * sent. ZIP-based Office formats (docx/xlsx/pptx) all share one signature; in a resume-upload
 * context a ZIP is overwhelmingly a .docx, so that's the practical call here. */
async function sniffExtension(blob: Blob): Promise<string> {
  const head = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
  const hex = Array.from(head).map((b) => b.toString(16).padStart(2, '0')).join('');
  if (hex.startsWith('25504446')) return 'pdf'; // %PDF
  if (hex.startsWith('504b0304') || hex.startsWith('504b0506') || hex.startsWith('504b0708')) return 'docx'; // ZIP / Office Open XML
  if (hex.startsWith('d0cf11e0a1b11ae1')) return 'doc'; // legacy OLE compound file (.doc/.xls/.ppt)
  if (hex.startsWith('ffd8ff')) return 'jpg';
  if (hex.startsWith('89504e47')) return 'png';
  return '';
}

export default function ResumeDocumentsTab() {
  const { candidate } = useCandidate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [detectedExt, setDetectedExt] = useState('');

  const resumeUrl: string = candidate?.resumeUrl || '';

  // Best-effort real extension for the button label — fetches just enough of the file to sniff
  // its magic bytes (a Range request, so this isn't downloading the whole resume just to label a
  // button). Silently falls back to the URL-based guess (or no label at all) if this fails; it
  // never blocks downloading, which re-sniffs from the full file regardless.
  useEffect(() => {
    setDetectedExt('');
    if (!resumeUrl) return;
    let cancelled = false;
    fetch(resumeUrl, { headers: { Range: 'bytes=0-15' } })
      .then((res) => res.blob())
      .then((blob) => sniffExtension(blob))
      .then((ext) => { if (!cancelled && ext) setDetectedExt(ext); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [resumeUrl]);

  if (!candidate) return null;

  const urlExtension = resumeUrl ? getExtension(resumeUrl) : '';
  const extension = detectedExt || urlExtension;
  const isPdf = extension === 'pdf';
  const isOfficeDoc = OFFICE_EXTENSIONS.has(extension);
  const fileLabel = isPdf ? 'PDF' : isOfficeDoc ? extension.toUpperCase() : extension ? extension.toUpperCase() : 'Document';
  const baseFileName = resumeUrl ? decodeURIComponent(resumeUrl.split('/').pop() || 'resume').split('?')[0] : 'resume';

  // Google's viewer fetches the file itself rather than the browser navigating straight to the
  // Cloudinary URL, which is what was causing a forced download the instant this tab opened —
  // Cloudinary serves "raw" resources (PDFs/Word docs) with a download-forcing header, and a
  // .docx/.pptx/.xlsx can't render in a plain <iframe> at all regardless of that header. This
  // renders every format consistently as an actual preview instead.
  const previewUrl = resumeUrl ? `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true` : '';

  // A plain link/window.open just follows the server's Content-Disposition — fine when it's set
  // to "attachment" (downloads), but on some uploads it isn't, so clicking "Download" would just
  // reopen the preview. Fetching the bytes and saving them as a blob always forces a real save,
  // with a correct, human-readable filename, regardless of what the server sends.
  const handleDownload = async () => {
    if (!resumeUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      const blob = await response.blob();

      // The file's own magic bytes (see sniffExtension) are what actually determines its real
      // extension — the server's Content-Type and the URL are both just hints that have each
      // turned out wrong for some uploads. Only falls back to those if sniffing is inconclusive,
      // and skips forcing any extension at all rather than risk another mislabeled file.
      const realExt = (await sniffExtension(blob)) || MIME_TO_EXT[mime] || extension || '';
      const alreadyHasExt = realExt ? baseFileName.toLowerCase().endsWith(`.${realExt}`) : true;
      const fileName = realExt && !alreadyHasExt ? `${baseFileName}.${realExt}` : baseFileName;

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Resume download failed, falling back to opening it directly', err);
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
      toast.error('Could not force a direct download — opened the file in a new tab instead.');
    } finally {
      setIsDownloading(false);
    }
  };

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
          {resumeUrl && (
            <Button variant="outline" className="h-8 px-3 text-[11px] font-bold" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
              Download {fileLabel}
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col min-h-[600px] bg-zinc-100/50">
          {resumeUrl ? (
            <iframe
              src={previewUrl}
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
