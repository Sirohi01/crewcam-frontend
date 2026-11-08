'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export type EntryField =
  | { key: string; label: string; type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea'; required?: boolean; placeholder?: string }
  | { key: string; label: string; type: 'select'; options: Array<{ value: string; label: string }>; required?: boolean }
  | { key: string; label: string; type: 'checkbox' };

type Values = Record<string, any>;

/** Date fields arrive as ISO strings; <input type="date"> needs YYYY-MM-DD. */
const toInputValue = (field: EntryField, value: any) => {
  if (value === undefined || value === null) return field.type === 'checkbox' ? false : '';
  if (field.type === 'date' && typeof value === 'string') return value.slice(0, 10);
  return value;
};

/**
 * Add/edit dialog for one row of a My Profile section (family member, emergency
 * contact, qualification, certification…). Field rules mirror the server's Zod schema;
 * the server stays the source of truth and its error message is shown on failure.
 */
type DialogProps = {
  open: boolean;
  title: string;
  fields: EntryField[];
  initial?: Values | null;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (values: Values) => void;
};

export function ProfileEntryDialog(props: DialogProps) {
  const { open, title, saving, onClose, initial } = props;
  return (
    <Dialog open={open} onOpenChange={(next) => !next && !saving && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px]">{title}</DialogTitle>
        </DialogHeader>
        {/* Keyed so each open starts from the row being edited (or blank for a new one). */}
        {open && <EntryForm key={initial?._id ?? 'new'} {...props} />}
      </DialogContent>
    </Dialog>
  );
}

function EntryForm({ fields, initial, saving, onClose, onSubmit }: DialogProps) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(fields.map((f) => [f.key, toInputValue(f, initial?.[f.key])]))
  );
  const [missing, setMissing] = useState<string[]>([]);

  const set = (key: string, value: any) => setValues((v) => ({ ...v, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const empty = fields.filter((f) => 'required' in f && f.required && !String(values[f.key] ?? '').trim()).map((f) => f.key);
    setMissing(empty);
    if (empty.length) return;
    const out: Values = { ...(initial?._id ? { _id: initial._id } : {}) };
    for (const f of fields) {
      const v = values[f.key];
      if (f.type === 'number') out[f.key] = v === '' ? undefined : Number(v);
      else if (f.type === 'checkbox') out[f.key] = Boolean(v);
      else out[f.key] = typeof v === 'string' ? v.trim() : v;
    }
    onSubmit(out);
  };

  return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2 py-2 max-h-[65vh] overflow-y-auto">
          {fields.map((f) => {
            const invalid = missing.includes(f.key);
            if (f.type === 'checkbox') {
              return (
                <label key={f.key} className="flex items-center gap-2 text-[12px] text-zinc-700 sm:col-span-2">
                  <input type="checkbox" checked={Boolean(values[f.key])} onChange={(e) => set(f.key, e.target.checked)} />
                  {f.label}
                </label>
              );
            }
            const wide = f.type === 'textarea';
            return (
              <div key={f.key} className={`flex flex-col gap-1 ${wide ? 'sm:col-span-2' : ''}`}>
                <Label htmlFor={`entry-${f.key}`} className="text-[11px] text-zinc-600">
                  {f.label}{'required' in f && f.required && <span className="text-red-500"> *</span>}
                </Label>
                {f.type === 'select' ? (
                  <select
                    id={`entry-${f.key}`}
                    value={values[f.key] ?? ''}
                    onChange={(e) => set(f.key, e.target.value)}
                    className={`h-9 rounded-md border bg-white px-2 text-[12px] ${invalid ? 'border-red-400' : 'border-zinc-200'}`}
                  >
                    <option value="">Select…</option>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    id={`entry-${f.key}`}
                    rows={3}
                    value={values[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.key, e.target.value)}
                    className={`rounded-md border px-2 py-1.5 text-[12px] ${invalid ? 'border-red-400' : 'border-zinc-200'}`}
                  />
                ) : (
                  <Input
                    id={`entry-${f.key}`}
                    type={f.type}
                    value={values[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.key, e.target.value)}
                    className={`h-9 text-[12px] ${invalid ? 'border-red-400' : ''}`}
                  />
                )}
                {invalid && <span className="text-[10px] text-red-500">{f.label} is required</span>}
              </div>
            );
          })}
          <DialogFooter className="sm:col-span-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" size="sm" disabled={saving} className="bg-[#1d4ed8] hover:bg-blue-700 text-white">
              {saving && <Loader2 size={14} className="mr-1 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </form>
  );
}
