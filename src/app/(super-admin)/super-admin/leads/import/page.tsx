'use client';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import api from '@/lib/axios';
import { parseCsv, downloadCsv } from '@/lib/csv';

const LEAD_FIELDS = [
  { key: '', label: "Don't import" },
  { key: 'companyName', label: 'Company Name *' },
  { key: 'contactName', label: 'Contact First Name *' },
  { key: 'contactSurname', label: 'Contact Surname' },
  { key: 'contactEmail', label: 'Contact Email *' },
  { key: 'contactPhone', label: 'Mobile No.' },
  { key: 'companyEmail', label: 'Official Email' },
  { key: 'companyWebsite', label: 'Company Website' },
  { key: 'typeOfBusiness', label: 'Type Of Business' },
  { key: 'industry', label: 'Industry / Sector' },
  { key: 'fullAddress', label: 'Full Address' },
  { key: 'country', label: 'Country' },
  { key: 'state', label: 'State' },
  { key: 'city', label: 'City' },
  { key: 'pinCode', label: 'Pin Code' },
  { key: 'source', label: 'Data Source' },
  { key: 'estimatedValue', label: 'Estimated Value' },
  { key: 'notes', label: 'Notes' },
];

function guessFieldForHeader(header: string): string {
  const h = header.trim().toLowerCase().replace(/[^a-z]/g, '');
  const match = LEAD_FIELDS.find((f) => f.key && h.includes(f.key.toLowerCase()));
  if (match) return match.key;
  if (h.includes('company') && h.includes('name')) return 'companyName';
  if (h.includes('email') && !h.includes('company') && !h.includes('official')) return 'contactEmail';
  if (h.includes('phone') || h.includes('mobile')) return 'contactPhone';
  if (h.includes('name') && !h.includes('company') && !h.includes('sur')) return 'contactName';
  return '';
}

type Step = 'upload' | 'map' | 'result';

export default function ImportLeadsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, string>>({});
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ created: number; failed: { row: number; message: string }[] } | null>(null);

  const handleFile = (file: File) => {
    setParseError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result || ''));
      if (rows.length < 2) {
        setParseError('CSV must have a header row and at least one data row.');
        return;
      }
      const [header, ...rest] = rows;
      setHeaders(header);
      setDataRows(rest);
      const guessed: Record<number, string> = {};
      header.forEach((h, i) => { guessed[i] = guessFieldForHeader(h); });
      setMapping(guessed);
      setStep('map');
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    downloadCsv('leads-import-template.csv', [
      ['Company Name', 'Contact First Name', 'Contact Email', 'Mobile No.', 'Industry', 'Data Source'],
      ['Acme Inc', 'John', 'john@acme.test', '9876543210', 'Manufacturing', 'WEBSITE'],
    ]);
  };

  const requiredMapped = ['companyName', 'contactName', 'contactEmail'].every((key) => Object.values(mapping).includes(key));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const leads = dataRows.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((_, i) => {
          const fieldKey = mapping[i];
          if (fieldKey && row[i]) obj[fieldKey] = row[i];
        });
        return obj;
      });
      const res = await api.post('/super-admin/leads/import', { leads });
      setResult(res.data);
      setStep('result');
    } catch (err: any) {
      setParseError(err?.response?.data?.message || 'Failed to import leads');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/leads" className="text-zinc-400 hover:text-zinc-600">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-md tracking-tight text-zinc-900 dark:text-zinc-50">Import Leads</h1>
          <p className="text-xs text-zinc-500">Bulk-create leads from a CSV file.</p>
        </div>
      </div>

      {step === 'upload' && (
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">Upload a CSV with a header row. You'll map columns to lead fields on the next step.</p>
              <Button variant="outline" onClick={handleDownloadTemplate} className="h-8 text-xs flex-shrink-0">
                <Download size={14} className="mr-1" /> Download Template
              </Button>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-200 rounded-lg p-10 text-center cursor-pointer hover:bg-zinc-50"
            >
              <Upload size={24} className="mx-auto text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-600">Click to choose a CSV file</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
            {parseError && <p className="text-xs text-rose-600">{parseError}</p>}
          </CardContent>
        </Card>
      )}

      {step === 'map' && (
        <div className="space-y-3">
          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600">
                  <span className="font-medium">{fileName}</span> — {dataRows.length} rows detected. Map each column to a lead field.
                </p>
                {!requiredMapped && <p className="text-[11px] text-rose-600">Company Name, Contact First Name, and Contact Email are required.</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {headers.map((h, i) => (
                  <div key={i} className="space-y-1">
                    <label className="block text-[11px] text-zinc-500 truncate" title={h}>CSV column: <span className="font-medium text-zinc-700">{h}</span></label>
                    <select
                      value={mapping[i] || ''}
                      onChange={(e) => setMapping((m) => ({ ...m, [i]: e.target.value }))}
                      className="w-full border border-zinc-200 text-xs px-2.5 py-1.5"
                    >
                      {LEAD_FIELDS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
            <CardContent className="p-4">
              <p className="text-xs font-md text-zinc-700 mb-2">Preview (first 5 rows)</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider border-b border-zinc-100">
                    <tr>
                      {headers.map((h, i) => <th key={i} className="px-2 py-1.5 whitespace-nowrap">{mapping[i] ? LEAD_FIELDS.find((f) => f.key === mapping[i])?.label : h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.slice(0, 5).map((row, ri) => (
                      <tr key={ri} className="border-b border-zinc-50">
                        {row.map((cell, ci) => <td key={ci} className="px-2 py-1.5 whitespace-nowrap text-zinc-600">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {parseError && <p className="text-xs text-rose-600">{parseError}</p>}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
            <Button disabled={!requiredMapped || submitting} onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {submitting ? 'Importing...' : `Import ${dataRows.length} Leads`}
            </Button>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <Card className="border-zinc-200/80 shadow-sm dark:border-zinc-800 rounded-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={18} />
              <p className="text-sm font-md">{result.created} lead{result.created === 1 ? '' : 's'} imported successfully.</p>
            </div>
            {result.failed.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-rose-600">
                  <XCircle size={16} />
                  <p className="text-sm font-md">{result.failed.length} row{result.failed.length === 1 ? '' : 's'} failed.</p>
                </div>
                <div className="max-h-48 overflow-y-auto border border-zinc-100 rounded-md">
                  {result.failed.map((f, i) => (
                    <div key={i} className="px-3 py-1.5 text-xs text-zinc-600 border-b border-zinc-50 last:border-0">
                      Row {f.row}: {f.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { setStep('upload'); setResult(null); setHeaders([]); setDataRows([]); }}>Import Another File</Button>
              <Link href="/super-admin/leads"><Button className="bg-indigo-600 text-white hover:bg-indigo-700">Go to Leads</Button></Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
