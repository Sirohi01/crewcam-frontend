'use client';

import { useState } from 'react';
import type { DetailsSection, MyDetails } from '@/services/meService';
import { useSaveMyDetailsSection } from './useMyProfile';

type Row<S extends DetailsSection> = MyDetails[S] extends Array<infer R> ? R & { _id?: string } : never;
export type ListSection = { [K in DetailsSection]: MyDetails[K] extends any[] ? K : never }[DetailsSection];

/**
 * Add / edit / delete for one list section of My Profile. The server replaces the whole
 * list on save, so every change sends the full list with the edited row applied.
 */
export function useProfileSectionEditor<S extends ListSection>(section: S, rows: Row<S>[] | undefined, noun: string) {
  const [editing, setEditing] = useState<Row<S> | null>(null);
  const [open, setOpen] = useState(false);
  const save = useSaveMyDetailsSection(section, `${noun} saved`);
  const list = rows || [];

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  return {
    rows: list,
    dialog: {
      open,
      initial: editing,
      saving: save.isPending,
      title: `${editing ? 'Edit' : 'Add'} ${noun}`,
      onClose: close,
      onSubmit: (values: Record<string, any>) => {
        const next = editing
          ? list.map((r) => (r._id && r._id === editing._id ? { ...r, ...values } : r))
          : [...list, values as Row<S>];
        save.mutate(next as unknown as MyDetails[S], { onSuccess: close });
      },
    },
    openAdd: () => {
      setEditing(null);
      setOpen(true);
    },
    openEdit: (row: Row<S>) => {
      setEditing(row);
      setOpen(true);
    },
    remove: (row: Row<S>) => {
      if (!window.confirm(`Delete this ${noun.toLowerCase()}?`)) return;
      save.mutate(list.filter((r) => r !== row) as unknown as MyDetails[S]);
    },
    isSaving: save.isPending,
  };
}

export type ProfileSectionEditor<S extends ListSection> = ReturnType<typeof useProfileSectionEditor<S>>;
