'use client';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  className?: string;
}

export function PrintButton({ className }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className={`btn-print ${className || ''}`}>
      <Printer className="h-4 w-4" />
      <span>Print</span>
    </button>
  );
}
