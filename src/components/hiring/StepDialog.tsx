'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HiringStepConfig } from '@/lib/hiringSteps';
import api from '@/lib/axios';

const inputClass = 'w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:bg-zinc-900 dark:border-zinc-700';

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = cur[keys[i]] || {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
};

interface StepDialogProps {
  step: HiringStepConfig;
  entityId: string;
  triggerLabel: string;
  triggerVariant?: 'default' | 'outline' | 'ghost';
}

export default function StepDialog({ step, entityId, triggerLabel, triggerVariant = 'outline' }: StepDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [flatValues, setFlatValues] = useState<Record<string, string>>({});
  const [arrayValues, setArrayValues] = useState<Record<string, Record<string, string>[]>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = { [step.entityField]: entityId };

      for (const field of step.fields) {
        const raw = flatValues[field.name];
        if (raw === undefined || raw === '') continue;
        const value = field.type === 'number' ? Number(raw) : raw;
        setNestedValue(payload, field.name, value);
      }

      for (const arrField of step.arrayFields || []) {
        const rows = arrayValues[arrField.name] || [];
        if (arrField.scalarArray) {
          payload[arrField.name] = rows.map(r => r.value).filter(Boolean);
        } else {
          payload[arrField.name] = rows.map(row => {
            const obj: any = {};
            for (const sf of arrField.subFields) {
              let v: any = row[sf.name];
              if (sf.type === 'number') v = Number(v);
              if (sf.name === 'isMandatory') v = v === 'true';
              obj[sf.name] = v;
            }
            return obj;
          });
        }
      }

      return (await api.post(step.apiPath, payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [step.id, entityId] });
      setOpen(false);
      setFlatValues({});
      setArrayValues({});
    }
  });

  const addRow = (arrName: string) => {
    setArrayValues(prev => ({ ...prev, [arrName]: [...(prev[arrName] || []), {}] }));
  };

  const removeRow = (arrName: string, idx: number) => {
    setArrayValues(prev => ({ ...prev, [arrName]: (prev[arrName] || []).filter((_, i) => i !== idx) }));
  };

  const updateRow = (arrName: string, idx: number, field: string, value: string) => {
    setArrayValues(prev => {
      const rows = [...(prev[arrName] || [])];
      rows[idx] = { ...rows[idx], [field]: value };
      return { ...prev, [arrName]: rows };
    });
  };

  const renderField = (field: HiringStepConfig['fields'][number]) => {
    const value = flatValues[field.name] || '';
    const onChange = (v: string) => setFlatValues(prev => ({ ...prev, [field.name]: v }));

    if (field.type === 'select') {
      return (
        <select value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
          <option value="">Select...</option>
          {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }
    if (field.type === 'textarea') {
      return <textarea value={value} onChange={e => onChange(e.target.value)} className={inputClass} rows={3} />;
    }
    return <input type={field.type} value={value} onChange={e => onChange(e.target.value)} className={inputClass} />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={triggerVariant} className="text-xs h-7 px-2.5" />}>
        {triggerLabel}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {step.fields.map(field => (
            <div key={field.name}>
              <label className="text-xs font-md text-zinc-700 dark:text-zinc-300 mb-1 block">{field.label}</label>
              {renderField(field)}
            </div>
          ))}

          {(step.arrayFields || []).map(arrField => (
            <div key={arrField.name} className="border border-zinc-200 dark:border-zinc-700 rounded-md p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-md text-zinc-700 dark:text-zinc-300">{arrField.label}</span>
                <Button type="button" variant="ghost" className="text-xs h-6 px-2" onClick={() => addRow(arrField.name)}>+ Add</Button>
              </div>
              <div className="flex flex-col gap-2">
                {(arrayValues[arrField.name] || []).map((row, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    {arrField.subFields.map(sf => (
                      <div key={sf.name} className="flex-1">
                        {sf.type === 'select' ? (
                          <select
                            value={row[sf.name] || ''}
                            onChange={e => updateRow(arrField.name, idx, sf.name, e.target.value)}
                            className={inputClass}
                          >
                            <option value="">{sf.label}</option>
                            {sf.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input
                            type={sf.type}
                            placeholder={sf.label}
                            value={row[sf.name] || ''}
                            onChange={e => updateRow(arrField.name, idx, sf.name, e.target.value)}
                            className={inputClass}
                          />
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => removeRow(arrField.name, idx)} className="text-rose-600 text-xs px-2 py-2">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
