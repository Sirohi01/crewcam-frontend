'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ForceLight() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');
  }, [setTheme]);

  return null;
}
