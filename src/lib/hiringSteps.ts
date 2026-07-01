export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';

export interface StepField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface ArrayFieldConfig {
  name: string;
  label: string;
  subFields: StepField[];
  scalarArray?: boolean;
  employeePicker?: boolean;
}

export interface ListColumn {
  key: string;
  label: string;
}

export interface HiringStepConfig {
  id: string;
  stepKey: string;
  step: number;
  phase: 'Offer & Legal' | 'Pre-Joining' | 'Onboarding' | 'Post-Joining';
  title: string;
  apiPath: string;
  entityField: 'candidateId' | 'employeeId';
  fields: StepField[];
  arrayFields?: ArrayFieldConfig[];
  listColumns?: ListColumn[];
  hasPdf?: boolean;
  postCreateActions?: {
    label: string;
    method: 'POST' | 'PUT';
    pathSuffix: string;
    payload?: Record<string, unknown>;
  }[];
}

export const HIRING_STEPS: HiringStepConfig[] = [
  {
    id: 'evaluation', stepKey: 'interviewEvaluation', step: 2, phase: 'Offer & Legal', title: 'Interview Evaluation Sheet',
    apiPath: '/hiring/evaluation', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateSnapshot.name', label: 'Candidate Name' },
      { key: 'candidateSnapshot.position', label: 'Position' },
      { key: 'candidateSnapshot.phone', label: 'Phone Number' },
      { key: 'candidateSnapshot.email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'candidateSnapshot.interviewDate', label: 'Interview Date' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Value' },
      { name: 'contactNo', label: 'Contact No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emailId', label: 'Email Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewDate', label: 'Interview Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewMode', label: 'Interview Mode', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewerName', label: 'Interviewer Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'topStrengths', label: 'Top Strengths', type: 'text', placeholder: 'e.g., Value' },
      { name: 'improvementAreas', label: 'Improvement Areas', type: 'text', placeholder: 'e.g., Value' },
      { name: 'recommendation', label: 'Recommendation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'salaryRangeFrom', label: 'Salary Range From', type: 'text', placeholder: 'e.g., Value' },
      { name: 'earliestJoining', label: 'Earliest Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewerStatus', label: 'Interviewer Status', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewerRemarks', label: 'Interviewer Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrReviewStatus', label: 'Hr Review Status', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrName', label: 'Hr Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hodFinalStatus', label: 'Hod Final Status', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hodName', label: 'Hod Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hodRemarks', label: 'Hod Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'roundType', label: 'Round Type', type: 'select', options: ['Telephonic', 'Technical', 'HR', 'Managerial', 'Final'], required: true },
      { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Strongly Recommend', 'Recommend', 'Neutral', 'Not Recommend', 'Strongly Reject'], required: true },
      { name: 'overallScore', label: 'Overall Score (1-5)', type: 'number', placeholder: 'e.g., 4' },
      { name: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'e.g., Strong technical skills, good communication...' },
      { name: 'weaknesses', label: 'Weaknesses', type: 'textarea', placeholder: 'e.g., Needs improvement in system design...' },
      { name: 'comments', label: 'Comments', type: 'textarea', placeholder: 'Any additional notes...' },
    ]
  },
  {
    id: 'selection-approval', stepKey: 'selectionApproval', step: 3, phase: 'Offer & Legal', title: 'Selection Approval Note',
    apiPath: '/hiring/selection-approval', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateId.name', label: 'Candidate Name' },
      { key: 'candidateId.jobRole', label: 'Position' },
      { key: 'candidateId.department', label: 'Department' },
      { key: 'candidateId.expectedJoiningDate', label: 'Date of Joining' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'sourceOthers', label: 'Source Others', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfInterview', label: 'Date Of Interview', type: 'text', placeholder: 'e.g., Value' },
      { name: 'interviewedBy', label: 'Interviewed By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'evaluationSummary', label: 'Evaluation Summary', type: 'text', placeholder: 'e.g., Value' },
      { name: 'proposedMonthlyCTC', label: 'Proposed Monthly C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'proposedAnnualCTC', label: 'Proposed Annual C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'salaryStructure', label: 'Salary Structure', type: 'text', placeholder: 'e.g., Value' },
      { name: 'budgetAvailability', label: 'Budget Availability', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrManagerName', label: 'Hr Manager Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'deptHeadName', label: 'Dept Head Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'managementName', label: 'Management Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'managementDecision', label: 'Management Decision', type: 'text', placeholder: 'e.g., Value' },
      { name: 'jobRole', label: 'Proposed Position', type: 'text', required: true },
      { name: 'recruitmentSource', label: 'Recruitment Source', type: 'text' },
      { name: 'proposedCTC', label: 'Proposed Annual CTC', type: 'number', required: true },
      { name: 'budgetedCTC', label: 'Budgeted CTC', type: 'number' },
      { name: 'recruitmentSummary', label: 'Recruitment Summary', type: 'textarea' },
      { name: 'justificationForVariance', label: 'Justification for Variance', type: 'textarea' },
      { name: 'approvalNotes', label: 'Approval Notes', type: 'textarea' },
    ],
    arrayFields: [{
      name: 'approvalChain', label: 'Approval Chain', employeePicker: true, subFields: [
        { name: 'role', label: 'Approver Role', type: 'text', required: true },
        { name: 'approverId', label: 'Approver', type: 'select', required: true },
      ]
    }],
    postCreateActions: [
      { label: 'Approve', method: 'PUT', pathSuffix: '/decision', payload: { finalStatus: 'Approved' } },
      { label: 'Reject', method: 'PUT', pathSuffix: '/decision', payload: { finalStatus: 'Rejected' } },
    ]
  },
  {
    id: 'ctc-breakup', stepKey: 'ctcBreakup', step: 4, phase: 'Offer & Legal', title: 'CTC Breakup',
    apiPath: '/hiring/ctc-breakup', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateId.name', label: 'Candidate Name' },
      { key: 'candidateId.jobRole', label: 'Position' },
      { key: 'department', label: 'Department' },
      { key: 'monthlyGross', label: 'Monthly Gross' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dear', label: 'Dear', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'effectiveDate', label: 'Effective Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'monthlyGross', label: 'Monthly Gross', type: 'text', placeholder: 'e.g., Value' },
      { name: 'annualCTC', label: 'Annual CTC', type: 'number', required: true, placeholder: 'e.g., 1500000' },
      { name: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'EUR'] },
      { name: 'breakup.basic', label: 'Annual Basic', type: 'number', placeholder: 'e.g., 750000' },
      { name: 'breakup.hra', label: 'Annual HRA', type: 'number', placeholder: 'e.g., 375000' },
      { name: 'breakup.conveyance', label: 'Annual Conveyance', type: 'number', placeholder: 'e.g., 19200' },
      { name: 'breakup.medicalAllowance', label: 'Annual Medical Allowance', type: 'number', placeholder: 'e.g., 15000' },
      { name: 'breakup.specialAllowance', label: 'Annual Special Allowance', type: 'number', placeholder: 'e.g., 200000' },
      { name: 'breakup.pfEmployer', label: 'Annual Employer PF', type: 'number', placeholder: 'e.g., 21600' },
      { name: 'breakup.pfEmployee', label: 'Annual Employee PF', type: 'number', placeholder: 'e.g., 21600' },
      { name: 'breakup.gratuity', label: 'Annual Gratuity', type: 'number', placeholder: 'e.g., 36000' },
      { name: 'breakup.bonus', label: 'Annual Bonus', type: 'number', placeholder: 'e.g., 50000' },
      { name: 'breakup.otherAllowances', label: 'Other Allowances', type: 'number', placeholder: 'e.g., 11600' },
    ]
  },
  {
    id: 'loi', stepKey: 'loi', step: 5, phase: 'Offer & Legal', title: 'Letter of Intent',
    apiPath: '/hiring/loi', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateId.name', label: 'Candidate Name' },
      { key: 'department', label: 'Department' },
      { key: 'position', label: 'Position' },
      { key: 'joiningDate', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTime', label: 'Reporting Time', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingLocation', label: 'Reporting Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g., Senior Software Engineer' },
      { name: 'proposedCTC', label: 'Proposed Annual CTC', type: 'number', placeholder: 'e.g., 1500000' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'validUntil', label: 'Valid Until', type: 'date' },
      { name: 'letterContent', label: 'Letter Content', type: 'textarea', placeholder: 'Dear Candidate, we are pleased to offer you...' },
    ]
  },
  {
    id: 'joining-confirmation', stepKey: 'joiningConfirmation', step: 6, phase: 'Pre-Joining', title: 'Joining Confirmation',
    apiPath: '/hiring/joining-confirmation', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateId.name', label: 'Candidate Name' },
      { key: 'position', label: 'Position' },
      { key: 'department', label: 'Department' },
      { key: 'joiningDate', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'failureToReportDate', label: 'Failure To Report Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Value' },
      { name: 'confirmedJoiningDate', label: 'Confirmed Joining Date', type: 'date', required: true },
      { name: 'reportingManagerName', label: 'Reporting Manager', type: 'text', placeholder: 'e.g., Jane Doe' },
      { name: 'reportingTime', label: 'Reporting Time', type: 'text', placeholder: 'e.g., 09:30 AM' },
      { name: 'reportingLocation', label: 'Reporting Location', type: 'text', placeholder: 'e.g., HQ, 5th Floor' },
    ],
    postCreateActions: [{ label: 'Mark Candidate Confirmed', method: 'PUT', pathSuffix: '/confirm' }]
  },
  {
    id: 'doc-checklist', stepKey: 'documentChecklist', step: 7, phase: 'Pre-Joining', title: 'Document Checklist',
    apiPath: '/hiring/doc-checklist', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'position', label: 'Position' },
      { key: 'employeeCode', label: 'Employee Code' },
      { key: 'department', label: 'Department' },
      { key: 'joiningDate', label: 'Date of Joining ' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeCode', label: 'Employee Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeSignatureDate', label: 'Employee Signature Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrName', label: 'Hr Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrSignatureDate', label: 'Hr Signature Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },],
    arrayFields: [{
      name: 'items', label: 'Documents', subFields: [
        { name: 'documentName', label: 'Document Name', type: 'text', required: true, placeholder: 'e.g., PAN Card' },
        { name: 'isMandatory', label: 'Mandatory', type: 'select', options: ['true', 'false'] },
        { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted', 'Verified', 'Rejected'] },
        { name: 'fileUrl', label: 'Document URL', type: 'text', placeholder: 'https://...' },
        { name: 'remarks', label: 'Remarks', type: 'text', placeholder: 'Any remarks...' },
      ]
    }]
  },
  {
    id: 'bgv', stepKey: 'bgvRequest', step: 8, phase: 'Pre-Joining', title: 'Background Verification',
    apiPath: '/hiring/bgv', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateName', label: 'Candidate Name' },
      { key: 'position', label: 'Position' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'positionFor', label: 'Position For', type: 'text', placeholder: 'e.g., Value' },
      { name: 'homeNo', label: 'Home No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'alternateNo', label: 'Alternate No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emailId', label: 'Email Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'mobileNo', label: 'Mobile No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'currentAddress', label: 'Current Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'currentState', label: 'Current State', type: 'text', placeholder: 'e.g., Value' },
      { name: 'currentCityPin', label: 'Current City Pin', type: 'text', placeholder: 'e.g., Value' },
      { name: 'currentCountry', label: 'Current Country', type: 'text', placeholder: 'e.g., Value' },
      { name: 'permanentAddress', label: 'Permanent Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'permanentState', label: 'Permanent State', type: 'text', placeholder: 'e.g., Value' },
      { name: 'permanentCityPin', label: 'Permanent City Pin', type: 'text', placeholder: 'e.g., Value' },
      { name: 'permanentCountry', label: 'Permanent Country', type: 'text', placeholder: 'e.g., Value' },
      { name: 'requestDate', label: 'Request Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'requestDesignation', label: 'Request Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'priorityLevel', label: 'Priority Level', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportCandidateName', label: 'Report Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportDOJ', label: 'Report D O J', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportEmpCode', label: 'Report Emp Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportDepartment', label: 'Report Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'vendor', label: 'BGV Vendor', type: 'text', placeholder: 'e.g., FirstAdvantage' },
      { name: 'overallResult', label: 'Current Result', type: 'select', options: ['Pending', 'Clear', 'Discrepancy'] },
    ],
    arrayFields: [{ name: 'checksRequested', label: 'Checks Requested', scalarArray: true, subFields: [{ name: 'value', label: 'Check', type: 'text', required: true, placeholder: 'e.g., Criminal Record Check' }] }]
  },
  {
    id: 'joining-form', stepKey: 'joiningForm', step: 9, phase: 'Onboarding', title: 'Employee Joining Form',
    apiPath: '/hiring/joining-form', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'position', label: 'Position' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'joiningDate', label: 'Date of Joining ' },
      { key: 'verification', label: 'Verification' },
      { key: 'status', label: 'Status' },
      { key: 'updatedAt', label: 'Last Update' }
    ],
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'gender', label: 'Gender', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dob', label: 'Dob', type: 'text', placeholder: 'e.g., Value' },
      { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'e.g., Value' },
      { name: 'fatherMotherName', label: 'Father Mother Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nationality', label: 'Nationality', type: 'text', placeholder: 'e.g., Value' },
      { name: 'maritalStatus', label: 'Marital Status', type: 'text', placeholder: 'e.g., Value' },
      { name: 'marriageAnniversary', label: 'Marriage Anniversary', type: 'text', placeholder: 'e.g., Value' },
      { name: 'currentAddress', label: 'Current Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'alternateNumber', label: 'Alternate Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'personalEmailId', label: 'Personal Email Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingManager', label: 'Reporting Manager', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'empCode', label: 'Emp Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeCategory', label: 'Employee Category', type: 'text', placeholder: 'e.g., Value' },
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'panNumber', label: 'Pan Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'drivingLicense', label: 'Driving License', type: 'text', placeholder: 'e.g., Value' },
      { name: 'passportNumber', label: 'Passport Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'bankName', label: 'Bank Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'branchName', label: 'Branch Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'ifscCode', label: 'Ifsc Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emergencyName', label: 'Emergency Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emergencyRelationship', label: 'Emergency Relationship', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emergencyMobile', label: 'Emergency Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emergencyAlternate', label: 'Emergency Alternate', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emergencyAddress', label: 'Emergency Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'lastEmployerName', label: 'Last Employer Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'lastDesignation', label: 'Last Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'lastSalary', label: 'Last Salary', type: 'text', placeholder: 'e.g., Value' },
      { name: 'lastDoj', label: 'Last Doj', type: 'text', placeholder: 'e.g., Value' },
      { name: 'lastDol', label: 'Last Dol', type: 'text', placeholder: 'e.g., Value' },
      { name: 'totalExperience', label: 'Total Experience', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reasonForLeaving', label: 'Reason For Leaving', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrVerifiedBy', label: 'Hr Verified By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrDate', label: 'Hr Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },
      // Personal Details
      { name: 'personalDetails.fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g., John Doe' },
      { name: 'personalDetails.dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'personalDetails.gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { name: 'personalDetails.bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'personalDetails.maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
      { name: 'personalDetails.nationality', label: 'Nationality', type: 'text', placeholder: 'e.g., Indian' },
      { name: 'personalDetails.fatherMotherName', label: "Father's / Mother's Name", type: 'text', placeholder: 'e.g., Robert Doe' },
      // Contact Details
      { name: 'contactDetails.mobileNumber', label: 'Mobile Number', type: 'text', required: true, placeholder: 'e.g., 9876543210' },
      { name: 'contactDetails.alternateNumber', label: 'Alternate Number', type: 'text', placeholder: 'e.g., 9876543211' },
      { name: 'contactDetails.personalEmail', label: 'Personal Email', type: 'text', placeholder: 'e.g., john.doe@example.com' },
      { name: 'contactDetails.currentAddress', label: 'Current Address', type: 'textarea', placeholder: 'e.g., 123 Main St, City' },
      { name: 'contactDetails.permanentAddress', label: 'Permanent Address', type: 'textarea', placeholder: 'e.g., 456 Old Town, City' },
      // Position
      { name: 'positionDetails.designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g., Software Engineer' },
      { name: 'positionDetails.department', label: 'Department', type: 'text', required: true, placeholder: 'e.g., Engineering' },
      { name: 'positionDetails.joiningDate', label: 'Joining Date', type: 'date', required: true },
      { name: 'positionDetails.reportingManager', label: 'Reporting Manager', type: 'text', placeholder: 'e.g., Jane Smith' },
      { name: 'positionDetails.workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Head Office' },
      { name: 'positionDetails.employeeCategory', label: 'Employee Category', type: 'select', options: ['Permanent', 'Contract', 'Probation', 'Intern'] },
      { name: 'positionDetails.empCode', label: 'Employee Code', type: 'text', placeholder: 'e.g., EMP001' },
      // Identification
      { name: 'identificationDetails.aadhaarNumber', label: 'Aadhaar Number', type: 'text', placeholder: 'e.g., 1234 5678 9012' },
      { name: 'identificationDetails.panNumber', label: 'PAN Number', type: 'text', placeholder: 'e.g., ABCDE1234F' },
      { name: 'identificationDetails.drivingLicense', label: 'Driving License', type: 'text', placeholder: 'e.g., DL1420110012345' },
      { name: 'identificationDetails.passportNumber', label: 'Passport Number', type: 'text', placeholder: 'e.g., A1234567' },
      { name: 'identificationDetails.uanNumber', label: 'UAN Number', type: 'text', placeholder: 'e.g., 100000000000' },
      // Emergency Contact
      { name: 'emergencyContact.name', label: 'Emergency Contact Name', type: 'text', placeholder: 'e.g., Mary Doe' },
      { name: 'emergencyContact.relationship', label: 'Emergency Relationship', type: 'text', placeholder: 'e.g., Spouse' },
      { name: 'emergencyContact.mobileNumber', label: 'Emergency Mobile', type: 'text', placeholder: 'e.g., 9876543212' },
      { name: 'emergencyContact.address', label: 'Emergency Address', type: 'textarea', placeholder: 'e.g., 123 Main St, City' },
      // Operational
      { name: 'operationalDetails.weeklyOff', label: 'Weekly Off', type: 'text', placeholder: 'e.g., Sunday' },
      { name: 'operationalDetails.shift', label: 'Shift', type: 'text', placeholder: 'e.g., Morning Shift' },
      { name: 'operationalDetails.dutyTimingFrom', label: 'Duty From', type: 'text', placeholder: 'e.g., 09:00 AM' },
      { name: 'operationalDetails.dutyTimingTo', label: 'Duty To', type: 'text', placeholder: 'e.g., 06:00 PM' },
      // Declaration
      { name: 'declaration.hrVerifiedBy', label: 'HR Verified By', type: 'text', placeholder: 'e.g., HR Manager Name' },
      { name: 'declaration.hrRemarks', label: 'HR Remarks', type: 'textarea', placeholder: 'Any remarks...' },
    ],
    arrayFields: [
      {
        name: 'educationDetails', label: 'Education Details', subFields: [
          { name: 'qualification', label: 'Qualification', type: 'text', required: true, placeholder: 'e.g., B.Tech' },
          { name: 'institution', label: 'Institution', type: 'text', placeholder: 'e.g., State University' },
          { name: 'yearOfPassing', label: 'Year of Passing', type: 'text', placeholder: 'e.g., 2020' },
          { name: 'percentage', label: 'Percentage / CGPA', type: 'text', placeholder: 'e.g., 85% or 8.5' },
        ]
      },
      {
        name: 'previousEmployment', label: 'Previous Employment', subFields: [
          { name: 'companyName', label: 'Company Name', type: 'text', required: true, placeholder: 'e.g., Tech Corp' },
          { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Junior Developer' },
          { name: 'fromDate', label: 'From Date', type: 'date' },
          { name: 'toDate', label: 'To Date', type: 'date' },
          { name: 'lastSalary', label: 'Last Salary', type: 'text', placeholder: 'e.g., 500000' },
          { name: 'reasonForLeaving', label: 'Reason for Leaving', type: 'text', placeholder: 'e.g., Career Growth' },
        ]
      },
    ],
    postCreateActions: [
      { label: 'Verify Form', method: 'PUT', pathSuffix: '/verify', payload: {} },
    ]
  },
  {
    id: 'nomination', stepKey: 'nomination', step: 10, phase: 'Onboarding', title: 'Nomination Form',
    apiPath: '/hiring/nomination', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'position', label: 'Position' },
      { key: 'department', label: 'Department' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'email', label: 'Email' },
      { key: 'empCode', label: 'EMP Code' },
      { key: 'nominee1', label: 'Nominee1' },
      { key: 'nominee2', label: 'Nominee2' },
      { key: 'verification', label: 'Verification' },
      { key: 'Status', label: 'Status' },
      { key: 'Last Update', label: 'Last Update' },

    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'empCode', label: 'Emp Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'fatherHusbandSpouse', label: 'Father Husband Spouse', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dob', label: 'Dob', type: 'text', placeholder: 'e.g., Value' },
      { name: 'gender', label: 'Gender', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'emailId', label: 'Email Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1FullName', label: 'Nominee1 Full Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1Relationship', label: 'Nominee1 Relationship', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1Dob', label: 'Nominee1 Dob', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1Mobile', label: 'Nominee1 Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1Address', label: 'Nominee1 Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee1Percentage', label: 'Nominee1 Percentage', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2FullName', label: 'Nominee2 Full Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2Relationship', label: 'Nominee2 Relationship', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2Dob', label: 'Nominee2 Dob', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2Mobile', label: 'Nominee2 Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2Percentage', label: 'Nominee2 Percentage', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominee2Address', label: 'Nominee2 Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'guardianName', label: 'Guardian Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'guardianMobile', label: 'Guardian Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'guardianAddress', label: 'Guardian Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'guardianRelationship', label: 'Guardian Relationship', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verifiedBy', label: 'Verified By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verifierRemarks', label: 'Verifier Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'nominationType', label: 'Nomination Type', type: 'select', options: ['PF', 'Gratuity', 'Insurance'], required: true },
      { name: 'declarationDate', label: 'Declaration Date', type: 'date' },
      { name: 'declarationPlace', label: 'Declaration Place', type: 'text', placeholder: 'e.g., Mumbai' },
      { name: 'witnessName', label: 'Witness Name', type: 'text', placeholder: 'e.g., John Smith' },
      { name: 'witnessDesignation', label: 'Witness Designation', type: 'text', placeholder: 'e.g., HR Manager' },
    ],
    arrayFields: [
      {
        name: 'nominees', label: 'Nominees', subFields: [
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g., Jane Doe' },
          { name: 'relationship', label: 'Relationship', type: 'text', required: true, placeholder: 'e.g., Spouse' },
          { name: 'dob', label: 'Date of Birth', type: 'date' },
          { name: 'sharePercentage', label: 'Share %', type: 'number', required: true, placeholder: 'e.g., 100' },
          { name: 'address', label: 'Address', type: 'text', placeholder: 'e.g., 123 Main St' },
          { name: 'isMinor', label: 'Is Minor', type: 'select', options: ['false', 'true'] },
          { name: 'guardianName', label: 'Guardian Name', type: 'text', placeholder: 'e.g., Robert Doe' },
          { name: 'guardianRelationship', label: 'Guardian Relationship', type: 'text', placeholder: 'e.g., Father' },
        ]
      }
    ],
    postCreateActions: [
      { label: 'Verify Nomination', method: 'PUT', pathSuffix: '/verify', payload: {} },
    ]
  },
  {
    id: 'bank-payroll', stepKey: 'bankPayrollInfo', step: 11, phase: 'Onboarding', title: 'Bank & Payroll Information',
    apiPath: '/hiring/bank-payroll', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'employeeCode', label: 'Employee Code' },
      { key: 'position', label: 'Position' },
      { key: 'bankName', label: 'Bank Name' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'verification', label: 'Verification' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'empCode', label: 'Emp Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'receivePayslipOnEmail', label: 'Receive Payslip On Email', type: 'text', placeholder: 'e.g., Value' },
      { name: 'payslipEmailId', label: 'Payslip Email Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'panNumber', label: 'Pan Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'pfApplicable', label: 'Pf Applicable', type: 'text', placeholder: 'e.g., Value' },
      { name: 'esiApplicable', label: 'Esi Applicable', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verifiedBy', label: 'Verified By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verificationDate', label: 'Verification Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },
      { name: 'bankName', label: 'Bank Name', type: 'text', required: true, placeholder: 'e.g., HDFC Bank' },
      { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', required: true, placeholder: 'e.g., John Doe' },
      { name: 'accountNumber', label: 'Account Number', type: 'text', required: true, placeholder: 'e.g., 50100012345678' },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true, placeholder: 'e.g., HDFC0001234' },
      { name: 'branchName', label: 'Branch Name', type: 'text', placeholder: 'e.g., MG Road Branch' },
      { name: 'accountType', label: 'Account Type', type: 'select', options: ['Savings', 'Current'] },
      { name: 'micrCode', label: 'MICR Code', type: 'text', placeholder: 'e.g., 110240001' },
      { name: 'panNumber', label: 'PAN Number', type: 'text', placeholder: 'e.g., ABCDE1234F' },
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', placeholder: 'e.g., 1234 5678 9012' },
      { name: 'uanNumber', label: 'UAN Number', type: 'text', placeholder: 'e.g., 100000000000' },
      { name: 'pfAccountNumber', label: 'PF Account Number', type: 'text', placeholder: 'e.g., MH/BAN/12345/678' },
      { name: 'esiNumber', label: 'ESI Number', type: 'text', placeholder: 'e.g., 31000000000000000' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Bank Transfer', 'Cheque', 'Cash'] },
      { name: 'pfApplicable', label: 'PF Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'esiApplicable', label: 'ESI Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'ptApplicable', label: 'Professional Tax Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'hrVerifiedBy', label: 'HR Verified By', type: 'text', placeholder: 'e.g., Jane Smith' },
      { name: 'hrRemarks', label: 'HR Remarks', type: 'textarea', placeholder: 'Any remarks...' },
    ],
    postCreateActions: [
      { label: 'Verify Bank Details', method: 'PUT', pathSuffix: '/verify', payload: {} },
    ]
  },
  {
    id: 'emergency-contact', stepKey: 'emergencyContact', step: 12, phase: 'Onboarding', title: 'Emergency Contact Details',
    apiPath: '/hiring/emergency-contact', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'position', label: 'Position' },
      { key: 'emergencyContact', label: 'Emergency Contact' },
      { key: 'contactNo', label: 'Contact No' },
      { key: 'empCode', label: 'EMP Code' },
      { key: 'bloodGroup', label: 'Blood Group' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'empCode', label: 'Emp Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'primaryName', label: 'Primary Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'primaryRelation', label: 'Primary Relation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'primaryMobile', label: 'Primary Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'primaryAlternateNo', label: 'Primary Alternate No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'primaryAddress', label: 'Primary Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'secondaryName', label: 'Secondary Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'secondaryRelation', label: 'Secondary Relation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'secondaryMobile', label: 'Secondary Mobile', type: 'text', placeholder: 'e.g., Value' },
      { name: 'secondaryAlternateNo', label: 'Secondary Alternate No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'secondaryAddress', label: 'Secondary Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'e.g., Value' },
      { name: 'knownMedicalConditions', label: 'Known Medical Conditions', type: 'text', placeholder: 'e.g., Value' },
      { name: 'allergies', label: 'Allergies', type: 'text', placeholder: 'e.g., Value' },
      { name: 'regularMedication', label: 'Regular Medication', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verifiedBy', label: 'Verified By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verificationDate', label: 'Verification Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrRemarks', label: 'Hr Remarks', type: 'text', placeholder: 'e.g., Value' },
      // Medical Info
      { name: 'medicalInfo.bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'medicalInfo.knownAllergies', label: 'Known Allergies', type: 'textarea', placeholder: 'e.g., Penicillin, Peanuts' },
      { name: 'medicalInfo.chronicConditions', label: 'Chronic Conditions', type: 'textarea', placeholder: 'e.g., Asthma, Diabetes' },
      { name: 'medicalInfo.currentMedications', label: 'Current Medications', type: 'text', placeholder: 'e.g., Inhaler' },
      { name: 'medicalInfo.doctorName', label: "Doctor's Name", type: 'text', placeholder: 'e.g., Dr. Smith' },
      { name: 'medicalInfo.doctorPhone', label: "Doctor's Phone", type: 'text', placeholder: 'e.g., 9876543210' },
      { name: 'medicalInfo.hospitalPreference', label: 'Preferred Hospital', type: 'text', placeholder: 'e.g., Apollo Hospital' },
      { name: 'medicalInfo.insurancePolicyNumber', label: 'Insurance Policy No.', type: 'text', placeholder: 'e.g., INS12345678' },
    ],
    arrayFields: [
      {
        name: 'contacts', label: 'Emergency Contacts', subFields: [
          { name: 'isPrimary', label: 'Primary Contact', type: 'select', options: ['true', 'false'] },
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g., Mary Doe' },
          { name: 'relationship', label: 'Relationship', type: 'text', required: true, placeholder: 'e.g., Spouse' },
          { name: 'phone', label: 'Phone', type: 'text', required: true, placeholder: 'e.g., 9876543212' },
          { name: 'alternatePhone', label: 'Alternate Phone', type: 'text', placeholder: 'e.g., 9876543213' },
          { name: 'email', label: 'Email', type: 'text', placeholder: 'e.g., mary@example.com' },
          { name: 'address', label: 'Address', type: 'text', placeholder: 'e.g., 123 Main St' },
        ]
      }
    ],
    postCreateActions: [
      { label: 'Verify Contact', method: 'PUT', pathSuffix: '/verify', payload: {} },
    ]
  },
  {
    id: 'offer-letter', stepKey: 'offerLetter', step: 13, phase: 'Offer & Legal', title: 'Offer Letter',
    apiPath: '/hiring/offer-letter', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'condidateename', label: 'Condidate Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'monthlyctc', label: 'Monthly CTC' },
      { key: 'joiningDate', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'probationPeriod', label: 'Probation Period', type: 'text', placeholder: 'e.g., Value' },
      { name: 'address', label: 'Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'monthlyCTC', label: 'Monthly C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'annualCTC', label: 'Annual C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workScheduleDays', label: 'Work Schedule Days', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workScheduleTimeStart', label: 'Work Schedule Time Start', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g., Senior Developer' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'validUntil', label: 'Offer Valid Until', type: 'date' },
      { name: 'offerContent', label: 'Offer Content', type: 'textarea', placeholder: 'Dear Candidate, we are pleased to offer you...' }
    ],
    postCreateActions: [
      { label: 'Accept Offer', method: 'PUT', pathSuffix: '/respond', payload: { status: 'Accepted' } },
      { label: 'Decline Offer', method: 'PUT', pathSuffix: '/respond', payload: { status: 'Declined' } },
    ]
  },
  {
    id: 'nda', stepKey: 'nda', step: 14, phase: 'Offer & Legal', title: 'NDA',
    apiPath: '/hiring/nda', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'condidateename', label: 'Condidate Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'fatherName', label: 'Father Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'age', label: 'Age', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'residentOf1', label: 'Resident Of1', type: 'text', placeholder: 'e.g., Value' },
      { name: 'residentOf2', label: 'Resident Of2', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness1Name', label: 'Witness1 Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness1Address', label: 'Witness1 Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness1Date', label: 'Witness1 Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness2Name', label: 'Witness2 Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness2Address', label: 'Witness2 Address', type: 'text', placeholder: 'e.g., Value' },
      { name: 'witness2Date', label: 'Witness2 Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'documentContent', label: 'NDA Content', type: 'textarea', placeholder: 'Non-Disclosure Agreement terms...' }
    ],
    postCreateActions: [{ label: 'Sign NDA', method: 'PUT', pathSuffix: '/sign' }]
  },
  {
    id: 'it-policy-accept', stepKey: 'itPolicyAcceptance', step: 15, phase: 'Onboarding', title: 'IT Policy & Acceptance',
    apiPath: '/hiring/it-policy-accept', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'employeecode', label: 'Employee Code' },
      { key: 'department', label: 'Department' },
      { key: 'joiningdate', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeCode', label: 'Employee Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'policyVersion', label: 'Policy Version', type: 'text', placeholder: 'e.g., v1.2' },
      { name: 'policyTitle', label: 'Policy Title', type: 'text', placeholder: 'e.g., General IT Policy' },
      { name: 'signerName', label: 'Signer Name', type: 'text', required: true, placeholder: 'e.g., Jane Doe' },
      { name: 'signerDesignation', label: 'Signer Designation', type: 'text', placeholder: 'e.g., Developer' },
      { name: 'policyContentSnapshot', label: 'Policy Content (snapshot)', type: 'textarea', placeholder: 'Policy terms...' },
    ]
  },
  {
    id: 'code-of-conduct-accept', stepKey: 'conductAcceptance', step: 16, phase: 'Onboarding', title: 'Code of Conduct Acceptance',
    apiPath: '/hiring/code-of-conduct-accept', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'employeecode', label: 'Employee Code' },
      { key: 'department', label: 'Department' },
      { key: 'joiningdate', label: 'Joining Date' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeCode', label: 'Employee Code', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfJoining', label: 'Date Of Joining', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'verifiedByHr', label: 'Verified By Hr', type: 'text', placeholder: 'e.g., Value' },
      { name: 'version', label: 'Conduct Policy Version', type: 'text', placeholder: 'e.g., v2.0' },
      { name: 'conductTitle', label: 'Conduct Title', type: 'text', placeholder: 'e.g., Employee Code of Conduct' },
      { name: 'signerName', label: 'Signer Name', type: 'text', required: true, placeholder: 'e.g., Jane Doe' },
      { name: 'signerDesignation', label: 'Signer Designation', type: 'text', placeholder: 'e.g., Developer' },
      { name: 'conductContentSnapshot', label: 'Conduct Content (snapshot)', type: 'textarea', placeholder: 'Conduct terms...' },
    ]
  },
  {
    id: 'appointment-letter', stepKey: 'appointmentLetter', step: 17, phase: 'Offer & Legal', title: 'Appointment Letter',
    apiPath: '/hiring/appointment-letter', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'condidateename', label: 'Condidate Name' },
      { key: 'position', label: 'Position' },
      { key: 'monthlyctc', label: 'Monthly CTC' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'date', label: 'Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dearName', label: 'Dear Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Value' },
      { name: 'commencementDate', label: 'Commencement Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTime', label: 'Reporting Time', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingLocation', label: 'Reporting Location', type: 'text', placeholder: 'e.g., Value' },
      { name: 'monthlyCTC', label: 'Monthly C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'annualCTC', label: 'Annual C T C', type: 'text', placeholder: 'e.g., Value' },
      { name: 'probationPeriod', label: 'Probation Period', type: 'text', placeholder: 'e.g., Value' },
      { name: 'workingHoursStart', label: 'Working Hours Start', type: 'text', placeholder: 'e.g., Value' },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', required: true, placeholder: 'e.g., Senior Analyst' },
      { name: 'departmentName', label: 'Department', type: 'text', placeholder: 'e.g., Finance' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., John Smith' },
      { name: 'workLocation', label: 'Work Location', type: 'text', placeholder: 'e.g., Mumbai HQ' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'probationPeriodMonths', label: 'Probation Period (months)', type: 'number', placeholder: 'e.g., 6' },
      { name: 'ctc', label: 'Annual CTC (₹)', type: 'number', placeholder: 'e.g., 1200000' },
      { name: 'ctcInWords', label: 'CTC In Words', type: 'text', placeholder: 'e.g., Twelve Lakhs Only' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Bank Transfer', 'Cheque', 'Cash'] },
      { name: 'workingHours', label: 'Working Hours', type: 'text', placeholder: 'e.g., 9 AM to 6 PM' },
      { name: 'workingDays', label: 'Working Days', type: 'text', placeholder: 'e.g., Monday to Friday' },
      { name: 'weeklyOff', label: 'Weekly Off', type: 'text', placeholder: 'e.g., Saturday, Sunday' },
      { name: 'letterContent', label: 'Letter Content', type: 'textarea', placeholder: 'Dear Employee...' },
    ],
    postCreateActions: [{ label: 'Acknowledge Appointment', method: 'PUT', pathSuffix: '/acknowledge' }]
  },
  {
    id: 'asset-access', stepKey: 'assetAccessForm', step: 18, phase: 'Onboarding', title: 'IT Assets, Access & Stationery',
    apiPath: '/hiring/asset-access', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'uniqueId', label: 'Unique ID' },
      { key: 'officialEmail', label: 'Official Email' },
      { key: 'mobilenumber', label: 'Mobile Number' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'uniqueId', label: 'Unique Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'personalEmail', label: 'Personal Email', type: 'text', placeholder: 'e.g., Value' },
      { name: 'officialEmail', label: 'Official Email', type: 'text', placeholder: 'e.g., Value' },
      { name: 'mobileNumber', label: 'Mobile Number', type: 'text', placeholder: 'e.g., Value' },
      { name: 'system_other', label: 'System_other', type: 'text', placeholder: 'e.g., Value' },
      { name: 'sharedFolder_other', label: 'Shared Folder_other', type: 'text', placeholder: 'e.g., Value' },
      { name: 'restrictedRolesDetailed', label: 'Restricted Roles Detailed', type: 'text', placeholder: 'e.g., Value' },
      { name: 'deviceType', label: 'Device Type', type: 'text', placeholder: 'e.g., Value' },
      { name: 'serialNo', label: 'Serial No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'modelNo', label: 'Model No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'softwareInstalled', label: 'Software Installed', type: 'text', placeholder: 'e.g., Value' },
      { name: 'processedBy', label: 'Processed By', type: 'text', placeholder: 'e.g., Value' },
      { name: 'accessCreatedOn', label: 'Access Created On', type: 'text', placeholder: 'e.g., Value' },
      { name: 'itRemarks', label: 'It Remarks', type: 'text', placeholder: 'e.g., Value' },],
    arrayFields: [
      {
        name: 'assetsIssued', label: 'Assets Issued', subFields: [
          { name: 'assetType', label: 'Asset Type', type: 'text', required: true, placeholder: 'e.g., Laptop' },
          { name: 'assetTag', label: 'Asset Tag', type: 'text', placeholder: 'e.g., LAP-001' },
          { name: 'serialNumber', label: 'Serial Number', type: 'text', placeholder: 'e.g., SN12345678' }
        ]
      },
      {
        name: 'accessGranted', label: 'Access Granted', subFields: [
          { name: 'systemName', label: 'System', type: 'text', required: true, placeholder: 'e.g., ERP System' },
          { name: 'accessLevel', label: 'Access Level', type: 'text', placeholder: 'e.g., Admin' }
        ]
      },
      {
        name: 'stationeryIssued', label: 'Stationery Issued', subFields: [
          { name: 'item', label: 'Item', type: 'text', required: true, placeholder: 'e.g., Notebook' },
          { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'e.g., 2' }
        ]
      }
    ]
  },
  {
    id: 'engagement-confirm', stepKey: 'engagementConfirmation', step: 19, phase: 'Onboarding', title: 'Engagement Confirmation',
    apiPath: '/hiring/engagement-confirm', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'uniqueId', label: 'Unique ID' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designaton' },
      { key: 'reportingto', label: 'Reporting To' },
      { key: 'officialmobilenumber', label: 'Official Mobile Number' },
      { key: 'createdon', label: 'Created On' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'uniqueId', label: 'Unique Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'officialMobileNo', label: 'Official Mobile No', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'signatureDate', label: 'Signature Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrName', label: 'Hr Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'hrVerificationDate', label: 'Hr Verification Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'engagementType', label: 'Engagement Type', type: 'select', options: ['Full-time', 'Contract', 'Consultant'] }
    ]
  },
  {
    id: 'induction', stepKey: 'induction', step: 20, phase: 'Onboarding', title: 'Induction Form',
    apiPath: '/hiring/induction', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'employeeid', label: 'Employee Id' },
      { key: 'designation', label: 'Designaton' },
      { key: 'department', label: 'Department' },
      { key: 'joiningdate', label: 'Joining Date' },
      { key: 'createdon', label: 'Created On' },
    ],
    fields: [
      { name: 'inductionDate', label: 'Induction Date', type: 'date' }
    ],
    arrayFields: [
      {
        name: 'modules', label: 'Induction Modules', subFields: [
          { name: 'moduleName', label: 'Module Name', type: 'text', required: true, placeholder: 'e.g., Company Policies' }
        ]
      }
    ],
    postCreateActions: [{ label: 'Complete First Module', method: 'PUT', pathSuffix: '/modules/0/complete' }]
  },
  {
    id: 'team-intro', stepKey: 'teamIntro', step: 21, phase: 'Onboarding', title: 'Team Introduction Note',
    apiPath: '/hiring/team-intro', entityField: 'candidateId', hasPdf: true,
    listColumns: [
      { key: 'candidateName', label: 'Candidate Name' },
      { key: 'position', label: 'Position' },
      { key: 'department', label: 'Department' },
      { key: 'joiningdate', label: 'Joining Date' },
      { key: 'reportingto', label: 'Reporting To' },
      { key: 'status', label: 'Status' },

    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'effectiveDate', label: 'Effective Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'introductionNote', label: 'Introduction Note', type: 'textarea', placeholder: 'Welcome our new team member...' }
    ],
    arrayFields: [
      {
        name: 'teamMembers', label: 'Team Members', subFields: [
          { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'e.g., John Smith' },
          { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Tech Lead' }
        ]
      }
    ]
  },
  {
    id: 'probation-review', stepKey: 'probationReview', step: 22, phase: 'Post-Joining', title: 'Probation Review Form',
    apiPath: '/hiring/probation-review', entityField: 'employeeId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'uniqueId', label: 'Unique ID' },
      { key: 'designation', label: 'Designaton' },
      { key: 'department', label: 'Department' },
      { key: 'reviewdate', label: 'Review Date' },
      { key: 'recommendation', label: 'Recommendation' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'candidateName', label: 'Candidate Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'uniqueId', label: 'Unique Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reviewDate', label: 'Review Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingManager', label: 'Reporting Manager', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingManagerSignatureName', label: 'Reporting Manager Signature Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingManagerDate', label: 'Reporting Manager Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reviewPeriodStart', label: 'Review Period Start', type: 'date' },
      { name: 'reviewPeriodEnd', label: 'Review Period End', type: 'date' }
    ],
    arrayFields: [
      {
        name: 'ratings', label: 'Ratings', subFields: [
          { name: 'parameter', label: 'Parameter', type: 'text', required: true, placeholder: 'e.g., Technical Skills' },
          { name: 'score', label: 'Score (1-5)', type: 'number', required: true, placeholder: 'e.g., 4' }
        ]
      }
    ],
    postCreateActions: [
      { label: 'Confirm Probation', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Confirmed' } },
      { label: 'Extend Probation', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Extended', extensionMonths: 1 } },
      { label: 'Terminate Probation', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Terminated' } },
    ]
  },
  {
    id: 'perf-eval', stepKey: 'performanceEval', step: 23, phase: 'Post-Joining', title: 'Employee Performance Evaluation',
    apiPath: '/hiring/perf-eval', entityField: 'employeeId', hasPdf: true,
    listColumns: [
      { key: 'employeename', label: 'Employee Name' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designaton' },
      { key: 'reviewperiod', label: 'Review Period' },
      { key: 'rating', label: 'Rating' },
      { key: 'status', label: 'Status' },
      { key: 'lastUpdate', label: 'Last Update' },
    ],
    fields: [
      { name: 'employeeName', label: 'Employee Name', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeId', label: 'Employee Id', type: 'text', placeholder: 'e.g., Value' },
      { name: 'department', label: 'Department', type: 'text', placeholder: 'e.g., Value' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'joiningDate', label: 'Joining Date', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reviewPeriod', label: 'Review Period', type: 'text', placeholder: 'e.g., Value' },
      { name: 'reportingManager', label: 'Reporting Manager', type: 'text', placeholder: 'e.g., Value' },
      { name: 'dateOfEvaluation', label: 'Date Of Evaluation', type: 'text', placeholder: 'e.g., Value' },
      { name: 'overallRating', label: 'Overall Rating', type: 'text', placeholder: 'e.g., Value' },
      { name: 'managerComments', label: 'Manager Comments', type: 'text', placeholder: 'e.g., Value' },
      { name: 'employeeComments', label: 'Employee Comments', type: 'text', placeholder: 'e.g., Value' },
      { name: 'evaluationPeriod', label: 'Evaluation Period', type: 'text', placeholder: 'e.g., Q1 2026' },
      { name: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'e.g., Good leadership...' },
      { name: 'areasOfImprovement', label: 'Areas of Improvement', type: 'textarea', placeholder: 'e.g., Needs to focus on...' },
      { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Confirm', 'Extend Probation', 'PIP', 'Terminate'] }
    ],
    arrayFields: [
      {
        name: 'kpis', label: 'KPIs', subFields: [
          { name: 'metric', label: 'Metric', type: 'text', required: true, placeholder: 'e.g., Sales Target' },
          { name: 'score', label: 'Score (1-5)', type: 'number', required: true, placeholder: 'e.g., 5' }
        ]
      }
    ]
  },
  {
    id: 'id-card', stepKey: 'idCard', step: 24, phase: 'Post-Joining', title: 'Visiting Card / ID Card',
    apiPath: '/hiring/id-card', entityField: 'employeeId', hasPdf: true,
    listColumns: [
      { key: 'employeeid', label: 'Employee Id' },
      { key: 'name', label: 'Name' },
      { key: 'mobilenumber', label: 'Mobile Number' },
      { key: 'department', label: 'Department' },
      { key: 'designation', label: 'Designation' }
    ],
    fields: [
      { name: 'cardType', label: 'Card Type', type: 'select', options: ['ID Card', 'Visiting Card'] },
      { name: 'employeeCode', label: 'Employee Code', type: 'text', placeholder: 'e.g., EMP123' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'e.g., Developer' },
      { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'e.g., O+' },
      { name: 'cardTheme', label: 'Card Theme Hex Colour', type: 'text', placeholder: 'e.g., #0d3c68' },
      { name: 'frontLabel', label: 'Front Label', type: 'text', placeholder: 'e.g., Staff' },
      { name: 'backNote', label: 'Back Note', type: 'textarea', placeholder: 'If found, return to...' },
      { name: 'qrPayload', label: 'QR Payload (optional)', type: 'textarea', placeholder: 'https://...' },
      { name: 'validFrom', label: 'Valid From', type: 'date' },
      { name: 'validTo', label: 'Valid To', type: 'date' }
    ],
    postCreateActions: [{ label: 'Mark Issued', method: 'PUT', pathSuffix: '/issue' }]
  },
  {
    id: 'release-qa', stepKey: 'releaseQA', step: 25, phase: 'Post-Joining', title: 'Release QA Checks',
    apiPath: '/hiring/release-qa', entityField: 'employeeId',
    fields: [
      { name: 'qaStatus', label: 'QA Status', type: 'select', options: ['Pending', 'Passed', 'Failed'] },
      { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Any QA remarks...' }
    ]
  }
];

export const getHiringStepById = (stepId: string) => HIRING_STEPS.find((step) => step.id === stepId);
