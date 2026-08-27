'use client';


interface PrintHeaderProps {
  title: string;
  subtitle?: string;
}

export function PrintHeader({ title, subtitle }: PrintHeaderProps) {
  return (
    <div className="print-only print-header w-full m-0 p-0">
      <img src="/newheader.png" alt="Company Header" className="w-full h-auto block border-none m-0" />
      <div className="mt-4 text-center px-[20mm]">
        <h2 style={{ fontSize: '18pt', fontWeight: 'bold', borderBottom: '2px solid #ed7d31', display: 'inline-block', padding: '0 40px 5px', color: '#ed7d31', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-2 uppercase tracking-widest italic">{subtitle}</p>}
      </div>
      <div className="w-full border-t border-black mb-6 mt-2"></div>
    </div>
  );
}
