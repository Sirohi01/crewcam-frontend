import { ColumnConfig } from '@/components/upload/bulkUploadModal';

export interface DesignationRow {
  name: string;
  code: string;
  jobGrade: string;
  jobFamily: string;
  businessUnit: string;
  division: string;
  department: string;
  reportsToDesignationId: string;
  employmentType: string;
  flsaType: string;
  isActive: string;
  effectiveFrom: string;
  summary: string;
  keyResponsibilities: string;
  keySkills: string;
  qualification: string;
  experienceRequired: string;
  ctcRange: string;
  designationLevel: string;
  location: string;
  remarks: string;
}

export const designationColumns: ColumnConfig<DesignationRow>[] = [
  { key: 'name', label: 'Designation Name', required: true, unique: true, sampleValue: 'Senior Manager' },
  { key: 'code', label: 'Short Code', required: true, unique: true, sampleValue: 'SR. MGR' },
  { key: 'jobGrade', label: 'Job Grade', required: true, sampleValue: 'JG-10' },
  { key: 'jobFamily', label: 'Job Family', required: true, sampleValue: 'Leadership' },
  { key: 'businessUnit', label: 'Business Unit', required: true, sampleValue: 'Retail Interiors' },
  { key: 'division', label: 'Division', required: true, sampleValue: 'Design Studio' },
  { key: 'department', label: 'Department', required: true, sampleValue: 'Space Planning' },
  { key: 'reportsToDesignationId', label: 'Reports To (Designation / Role)', sampleValue: 'Managing Director' },
  { key: 'employmentType', label: 'Employment Type', sampleValue: 'Full Time' },
  { key: 'flsaType', label: 'FLSA / Overtime Type', sampleValue: 'Exempt' },
  { key: 'isActive', label: 'Status', required: true, sampleValue: 'Active', validate: (v) => (['active', 'inactive'].includes(String(v).toLowerCase()) ? null : 'Status must be Active or Inactive') },
  { key: 'effectiveFrom', label: 'Effective From', required: true, sampleValue: '2026-01-01' },
  { key: 'summary', label: 'Designation Summary', sampleValue: 'Brief summary of the designation' },
  { key: 'keyResponsibilities', label: 'Key Responsibilities', sampleValue: 'Lead team, manage projects' },
  { key: 'keySkills', label: 'Key Skills / Competencies', sampleValue: 'Leadership, Communication' },
  { key: 'qualification', label: 'Qualification', sampleValue: 'MBA, B.Tech' },
  { key: 'experienceRequired', label: 'Experience Required', sampleValue: '5+ years' },
  { key: 'ctcRange', label: 'CTC Range (₹)', sampleValue: '10-20 LPA' },
  { key: 'designationLevel', label: 'Designation Level', sampleValue: 'Managerial' },
  { key: 'location', label: 'Location', sampleValue: 'Delhi (HQ)' },
  { key: 'remarks', label: 'Remarks', sampleValue: 'Any additional remarks' },
];
