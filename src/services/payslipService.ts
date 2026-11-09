import api from '@/lib/axios';

/**
 * The signed-in employee's pay. /finance/salary-slips is self-scoped for employees
 * (issued slips only); /me/salary-structure is the caller's own structure.
 */

export interface SalarySlip {
  _id: string;
  month: number; // 1-12
  year: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'Draft' | 'Generated' | 'Paid';
  updatedAt?: string;
  breakdown?: {
    earnings?: { basic?: number; hra?: number; conveyance?: number; specialAllowance?: number };
    deductions?: { pf?: number; esi?: number; tax?: number; other?: number };
  };
}

export interface MySalaryStructure {
  earnings: { basic: number; hra: number; conveyance: number; specialAllowance: number };
  deductions: { pf: number; esi: number; tax: number };
  monthlyGross: number;
  monthlyDeductions: number;
  monthlyNet: number;
  annualGross: number;
  updatedAt?: string;
}

export const getMySalarySlips = async (): Promise<SalarySlip[]> => (await api.get('/finance/salary-slips')).data;

export const getMySalaryStructure = async (): Promise<MySalaryStructure | null> => (await api.get('/me/salary-structure')).data.data;

export const inr = (n?: number) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;

export const monthLabel = (s: Pick<SalarySlip, 'month' | 'year'>, style: 'short' | 'long' = 'short') =>
  new Date(s.year, s.month - 1, 1).toLocaleString('en-IN', { month: style, year: style === 'short' ? 'numeric' : undefined });

/** Indian financial year (April–March) a slip belongs to, e.g. "2026-27". */
export const financialYearOf = (s: Pick<SalarySlip, 'month' | 'year'>) => {
  const start = s.month >= 4 ? s.year : s.year - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
};

export const currentFinancialYear = () => {
  const now = new Date();
  return financialYearOf({ month: now.getMonth() + 1, year: now.getFullYear() });
};

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/** Opens a printable payslip (the browser's "Save as PDF" turns it into a file). */
export const printPayslip = (slip: SalarySlip, employee: { name: string; code?: string; designation?: string; company?: string }) => {
  const e = slip.breakdown?.earnings || {};
  const d = slip.breakdown?.deductions || {};
  const rows = (pairs: Array<[string, number | undefined]>) =>
    pairs.filter(([, v]) => (v || 0) > 0).map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td class="r">${escapeHtml(inr(v))}</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Payslip ${escapeHtml(monthLabel(slip, 'long'))}</title>
<style>body{font-family:system-ui,sans-serif;color:#18181b;margin:32px}h1{font-size:20px;margin:0}p{margin:2px 0;color:#52525b;font-size:13px}
table{width:100%;border-collapse:collapse;margin-top:16px;font-size:13px}td,th{border-bottom:1px solid #e4e4e7;padding:6px 4px;text-align:left}.r{text-align:right}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.net{margin-top:20px;font-size:16px;font-weight:700}</style></head><body>
<h1>${escapeHtml(employee.company || 'Payslip')}</h1><p>Payslip for ${escapeHtml(monthLabel(slip, 'long'))}</p>
<p>${escapeHtml(employee.name)}${employee.code ? ` · ${escapeHtml(employee.code)}` : ''}${employee.designation ? ` · ${escapeHtml(employee.designation)}` : ''}</p>
<div class="grid"><table><tr><th>Earnings</th><th class="r">Amount</th></tr>${rows([['Basic', e.basic], ['HRA', e.hra], ['Conveyance', e.conveyance], ['Special Allowance', e.specialAllowance]])}
<tr><th>Total Earnings</th><th class="r">${escapeHtml(inr(slip.totalEarnings))}</th></tr></table>
<table><tr><th>Deductions</th><th class="r">Amount</th></tr>${rows([['Provident Fund', d.pf], ['ESI', d.esi], ['Income Tax (TDS)', d.tax], ['Other', d.other]])}
<tr><th>Total Deductions</th><th class="r">${escapeHtml(inr(slip.totalDeductions))}</th></tr></table></div>
<p class="net">Net Pay: ${escapeHtml(inr(slip.netPay))}</p><p>Status: ${escapeHtml(slip.status)}</p>
<script>window.onload=function(){window.print()}</script></body></html>`;
  const win = window.open('', '_blank', 'noopener=no,width=820,height=900');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  return true;
};
