import type { DepartmentFormData } from '@/context/DepartmentFormContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A department code becomes the short tag shown everywhere (sidebar, reports, exports),
// so it's kept to the same shape the auto-generate-from-name logic already produces:
// letters/numbers/hyphen/underscore, uppercased.
export const sanitizeDepartmentCode = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');

export const isValidEmployeeCapacity = (value: string): boolean => {
  if (!value.trim()) return true; // optional
  return /^\d+$/.test(value.trim()) && Number(value) > 0;
};

export const isValidDepartmentEmail = (value: string): boolean => {
  if (!value.trim()) return true; // optional
  return EMAIL_RE.test(value.trim());
};

export const isValidProbationPeriod = (value: string): boolean => {
  if (!value.trim()) return true; // optional
  return /^\d+$/.test(value.trim()) && Number(value) >= 0 && Number(value) <= 24;
};

/**
 * The full set of checks run once, right before create/update — the authoritative gate,
 * since a direct link to the review step (or a step skipped via back/forward) must not be
 * able to submit something the per-step "Next" buttons would have blocked.
 */
export const getDepartmentFormErrors = (formData: DepartmentFormData): string[] => {
  const errors: string[] = [];
  if (!formData.name.trim()) errors.push('Department Name is required.');
  if (!formData.code.trim()) errors.push('Department Code is required.');
  if (!formData.departmentType.trim()) errors.push('Department Type is required.');
  if (!formData.businessUnit.trim()) errors.push('Business Unit is required.');
  if (!formData.effectiveDate.trim()) errors.push('Effective Date is required.');
  if (!isValidEmployeeCapacity(formData.employeeCapacity)) errors.push('Employee Capacity must be a positive whole number.');
  if (!isValidDepartmentEmail(formData.departmentEmail)) errors.push('Department Email is not a valid email address.');
  if (!isValidProbationPeriod(formData.probationPeriodMonths)) errors.push('Probation Period must be a number of months between 0 and 24.');
  return errors;
};
