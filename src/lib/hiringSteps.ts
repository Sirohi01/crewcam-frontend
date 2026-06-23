export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea';

export interface StepField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

export interface ArrayFieldConfig {
  name: string;
  label: string;
  subFields: StepField[];
  scalarArray?: boolean;
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
    apiPath: '/hiring/evaluation', entityField: 'candidateId',
    fields: [
      { name: 'roundType', label: 'Round Type', type: 'select', options: ['Telephonic', 'Technical', 'HR', 'Managerial', 'Final'], required: true },
      { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Strongly Recommend', 'Recommend', 'Neutral', 'Not Recommend', 'Strongly Reject'], required: true },
      { name: 'overallScore', label: 'Overall Score (1-5)', type: 'number' },
      { name: 'strengths', label: 'Strengths', type: 'textarea' },
      { name: 'weaknesses', label: 'Weaknesses', type: 'textarea' },
      { name: 'comments', label: 'Comments', type: 'textarea' }
    ]
  },
  /*
  {
    id: 'selection-approval', stepKey: 'selectionApproval', step: 3, phase: 'Offer & Legal', title: 'Selection Approval Note',
    apiPath: '/hiring/selection-approval', entityField: 'candidateId',
    fields: [
      { name: 'jobRole', label: 'Job Role', type: 'text', required: true },
      { name: 'proposedCTC', label: 'Proposed CTC', type: 'number' }
    ],
    postCreateActions: [
      { label: 'Approve Selection', method: 'PUT', pathSuffix: '/decision', payload: { finalStatus: 'Approved' } },
      { label: 'Reject Selection', method: 'PUT', pathSuffix: '/decision', payload: { finalStatus: 'Rejected' } },
    ]
  },
  {
    id: 'ctc-breakup', stepKey: 'ctcBreakup', step: 4, phase: 'Offer & Legal', title: 'CTC Breakup',
    apiPath: '/hiring/ctc-breakup', entityField: 'candidateId',
    fields: [
      { name: 'annualCTC', label: 'Annual CTC', type: 'number', required: true },
      { name: 'breakup.basic', label: 'Basic', type: 'number' },
      { name: 'breakup.hra', label: 'HRA', type: 'number' },
      { name: 'breakup.conveyance', label: 'Conveyance', type: 'number' },
      { name: 'breakup.medicalAllowance', label: 'Medical Allowance', type: 'number' },
      { name: 'breakup.specialAllowance', label: 'Special Allowance', type: 'number' },
      { name: 'breakup.pfEmployer', label: 'PF (Employer)', type: 'number' },
      { name: 'breakup.pfEmployee', label: 'PF (Employee)', type: 'number' },
      { name: 'breakup.gratuity', label: 'Gratuity', type: 'number' },
      { name: 'breakup.bonus', label: 'Bonus', type: 'number' }
    ]
  },
  {
    id: 'loi', stepKey: 'loi', step: 5, phase: 'Offer & Legal', title: 'Letter of Intent (LOI)',
    apiPath: '/hiring/loi', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'proposedCTC', label: 'Proposed CTC', type: 'number' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'validUntil', label: 'Valid Until', type: 'date' },
      { name: 'letterContent', label: 'Letter Content', type: 'textarea' }
    ]
  },
  {
    id: 'joining-confirmation', stepKey: 'joiningConfirmation', step: 6, phase: 'Pre-Joining', title: 'Joining Confirmation Mail',
    apiPath: '/hiring/joining-confirmation', entityField: 'candidateId',
    fields: [
      { name: 'confirmedJoiningDate', label: 'Confirmed Joining Date', type: 'date', required: true },
      { name: 'reportingTime', label: 'Reporting Time', type: 'text' },
      { name: 'reportingLocation', label: 'Reporting Location', type: 'text' }
    ],
    postCreateActions: [{ label: 'Confirm Joining', method: 'PUT', pathSuffix: '/confirm' }]
  },
  {
    id: 'doc-checklist', stepKey: 'documentChecklist', step: 7, phase: 'Pre-Joining', title: 'Document Checklist',
    apiPath: '/hiring/doc-checklist', entityField: 'candidateId',
    fields: [],
    arrayFields: [
      { name: 'items', label: 'Required Documents', subFields: [
        { name: 'documentName', label: 'Document Name', type: 'text', required: true },
        { name: 'isMandatory', label: 'Mandatory', type: 'select', options: ['true', 'false'] }
      ] }
    ],
    postCreateActions: [{ label: 'Verify First Item', method: 'PUT', pathSuffix: '/items/0', payload: { status: 'Verified' } }]
  },
  {
    id: 'bgv', stepKey: 'bgvRequest', step: 8, phase: 'Pre-Joining', title: 'BGV Request Form & Report',
    apiPath: '/hiring/bgv', entityField: 'candidateId',
    fields: [
      { name: 'vendor', label: 'BGV Vendor', type: 'text' }
    ],
    arrayFields: [
      { name: 'checksRequested', label: 'Checks Requested', scalarArray: true, subFields: [
        { name: 'value', label: 'Check (e.g. Identity, Education)', type: 'text', required: true }
      ] }
    ],
    postCreateActions: [{ label: 'Mark BGV Clear', method: 'PUT', pathSuffix: '/report', payload: { status: 'Completed', overallResult: 'Clear' } }]
  },
  {
    id: 'joining-form', stepKey: 'joiningForm', step: 9, phase: 'Onboarding', title: 'Employee Joining Form',
    apiPath: '/hiring/joining-form', entityField: 'candidateId',
    fields: [
      { name: 'personalDetails.dob', label: 'Date of Birth', type: 'date' },
      { name: 'personalDetails.gender', label: 'Gender', type: 'text' },
      { name: 'personalDetails.maritalStatus', label: 'Marital Status', type: 'text' },
      { name: 'personalDetails.bloodGroup', label: 'Blood Group', type: 'text' },
      { name: 'personalDetails.nationality', label: 'Nationality', type: 'text' },
      { name: 'addressDetails.currentAddress', label: 'Current Address', type: 'textarea' },
      { name: 'addressDetails.permanentAddress', label: 'Permanent Address', type: 'textarea' }
    ]
  },
  {
    id: 'nomination', stepKey: 'nomination', step: 10, phase: 'Onboarding', title: 'Nomination Form',
    apiPath: '/hiring/nomination', entityField: 'candidateId',
    fields: [
      { name: 'nominationType', label: 'Nomination Type', type: 'select', options: ['PF', 'Gratuity', 'Insurance'], required: true }
    ],
    arrayFields: [
      { name: 'nominees', label: 'Nominees', subFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'text', required: true },
        { name: 'sharePercentage', label: 'Share %', type: 'number', required: true }
      ] }
    ]
  },
  {
    id: 'bank-payroll', stepKey: 'bankPayrollInfo', step: 11, phase: 'Onboarding', title: 'Bank & Payroll Information',
    apiPath: '/hiring/bank-payroll', entityField: 'candidateId',
    fields: [
      { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
      { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
      { name: 'branchName', label: 'Branch Name', type: 'text' },
      { name: 'accountType', label: 'Account Type', type: 'select', options: ['Savings', 'Current'] },
      { name: 'panNumber', label: 'PAN Number', type: 'text' },
      { name: 'uanNumber', label: 'UAN Number', type: 'text' }
    ]
  },
  {
    id: 'emergency-contact', stepKey: 'emergencyContact', step: 12, phase: 'Onboarding', title: 'Emergency Contact Details',
    apiPath: '/hiring/emergency-contact', entityField: 'candidateId',
    fields: [],
    arrayFields: [
      { name: 'contacts', label: 'Emergency Contacts', subFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'relationship', label: 'Relationship', type: 'text', required: true },
        { name: 'phone', label: 'Phone', type: 'text', required: true }
      ] }
    ]
  },
  {
    id: 'offer-letter', stepKey: 'offerLetter', step: 13, phase: 'Offer & Legal', title: 'Offer Letter',
    apiPath: '/hiring/offer-letter', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'validUntil', label: 'Offer Valid Until', type: 'date' },
      { name: 'offerContent', label: 'Offer Content', type: 'textarea' }
    ],
    postCreateActions: [
      { label: 'Accept Offer', method: 'PUT', pathSuffix: '/respond', payload: { status: 'Accepted' } },
      { label: 'Decline Offer', method: 'PUT', pathSuffix: '/respond', payload: { status: 'Declined' } },
    ]
  },
  {
    id: 'nda', stepKey: 'nda', step: 14, phase: 'Offer & Legal', title: 'NDA',
    apiPath: '/hiring/nda', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'documentContent', label: 'NDA Content', type: 'textarea' }
    ],
    postCreateActions: [{ label: 'Sign NDA', method: 'PUT', pathSuffix: '/sign' }]
  },
  {
    id: 'it-policy-accept', stepKey: 'itPolicyAcceptance', step: 15, phase: 'Onboarding', title: 'IT Policy & Acceptance',
    apiPath: '/hiring/it-policy-accept', entityField: 'candidateId',
    fields: [
      { name: 'policyVersion', label: 'Policy Version', type: 'text' }
    ]
  },
  {
    id: 'code-of-conduct-accept', stepKey: 'conductAcceptance', step: 16, phase: 'Onboarding', title: 'Code of Conduct Acceptance',
    apiPath: '/hiring/code-of-conduct-accept', entityField: 'candidateId',
    fields: [
      { name: 'version', label: 'Conduct Policy Version', type: 'text' }
    ]
  },
  {
    id: 'appointment-letter', stepKey: 'appointmentLetter', step: 17, phase: 'Offer & Legal', title: 'Appointment Letter',
    apiPath: '/hiring/appointment-letter', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'ctc', label: 'CTC', type: 'number' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'probationPeriodMonths', label: 'Probation Period (months)', type: 'number' },
      { name: 'letterContent', label: 'Letter Content', type: 'textarea' }
    ],
    postCreateActions: [{ label: 'Acknowledge Appointment', method: 'PUT', pathSuffix: '/acknowledge' }]
  },
  {
    id: 'asset-access', stepKey: 'assetAccessForm', step: 18, phase: 'Onboarding', title: 'IT Assets, Access & Stationery',
    apiPath: '/hiring/asset-access', entityField: 'candidateId',
    fields: [],
    arrayFields: [
      { name: 'assetsIssued', label: 'Assets Issued', subFields: [
        { name: 'assetType', label: 'Asset Type', type: 'text', required: true },
        { name: 'assetTag', label: 'Asset Tag', type: 'text' },
        { name: 'serialNumber', label: 'Serial Number', type: 'text' }
      ] },
      { name: 'accessGranted', label: 'Access Granted', subFields: [
        { name: 'systemName', label: 'System', type: 'text', required: true },
        { name: 'accessLevel', label: 'Access Level', type: 'text' }
      ] },
      { name: 'stationeryIssued', label: 'Stationery Issued', subFields: [
        { name: 'item', label: 'Item', type: 'text', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number' }
      ] }
    ]
  },
  {
    id: 'engagement-confirm', stepKey: 'engagementConfirmation', step: 19, phase: 'Onboarding', title: 'Engagement Confirmation',
    apiPath: '/hiring/engagement-confirm', entityField: 'candidateId',
    fields: [
      { name: 'engagementType', label: 'Engagement Type', type: 'select', options: ['Full-time', 'Contract', 'Consultant'] }
    ]
  },
  {
    id: 'induction', stepKey: 'induction', step: 20, phase: 'Onboarding', title: 'Induction Form',
    apiPath: '/hiring/induction', entityField: 'candidateId',
    fields: [
      { name: 'inductionDate', label: 'Induction Date', type: 'date' }
    ],
    arrayFields: [
      { name: 'modules', label: 'Induction Modules', subFields: [
        { name: 'moduleName', label: 'Module Name', type: 'text', required: true }
      ] }
    ],
    postCreateActions: [{ label: 'Complete First Module', method: 'PUT', pathSuffix: '/modules/0/complete' }]
  },
  {
    id: 'team-intro', stepKey: 'teamIntro', step: 21, phase: 'Onboarding', title: 'Team Introduction Note',
    apiPath: '/hiring/team-intro', entityField: 'candidateId',
    fields: [
      { name: 'introductionNote', label: 'Introduction Note', type: 'textarea' }
    ],
    arrayFields: [
      { name: 'teamMembers', label: 'Team Members', subFields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'designation', label: 'Designation', type: 'text' }
      ] }
    ]
  },
  {
    id: 'probation-review', stepKey: 'probationReview', step: 22, phase: 'Post-Joining', title: 'Probation Review Form',
    apiPath: '/hiring/probation-review', entityField: 'employeeId',
    fields: [
      { name: 'reviewPeriodStart', label: 'Review Period Start', type: 'date' },
      { name: 'reviewPeriodEnd', label: 'Review Period End', type: 'date' }
    ],
    arrayFields: [
      { name: 'ratings', label: 'Ratings', subFields: [
        { name: 'parameter', label: 'Parameter', type: 'text', required: true },
        { name: 'score', label: 'Score (1-5)', type: 'number', required: true }
      ] }
    ],
    postCreateActions: [
      { label: 'Confirm Probation Decision', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Confirmed' } },
      { label: 'Extend Probation', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Extended', extensionMonths: 1 } },
      { label: 'Terminate Probation', method: 'PUT', pathSuffix: '/decision', payload: { decision: 'Terminated' } },
    ]
  },
  {
    id: 'perf-eval', stepKey: 'performanceEval', step: 23, phase: 'Post-Joining', title: 'Employee Performance Evaluation',
    apiPath: '/hiring/perf-eval', entityField: 'employeeId',
    fields: [
      { name: 'evaluationPeriod', label: 'Evaluation Period', type: 'text' },
      { name: 'strengths', label: 'Strengths', type: 'textarea' },
      { name: 'areasOfImprovement', label: 'Areas of Improvement', type: 'textarea' },
      { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Confirm', 'Extend Probation', 'PIP', 'Terminate'] }
    ],
    arrayFields: [
      { name: 'kpis', label: 'KPIs', subFields: [
        { name: 'metric', label: 'Metric', type: 'text', required: true },
        { name: 'score', label: 'Score (1-5)', type: 'number', required: true }
      ] }
    ]
  },
  {
    id: 'id-card', stepKey: 'idCard', step: 24, phase: 'Post-Joining', title: 'Visiting Card / ID Card',
    apiPath: '/hiring/id-card', entityField: 'employeeId', hasPdf: true,
    fields: [
      { name: 'cardType', label: 'Card Type', type: 'select', options: ['ID Card', 'Visiting Card'] },
      { name: 'employeeCode', label: 'Employee Code', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'bloodGroup', label: 'Blood Group', type: 'text' },
      { name: 'validFrom', label: 'Valid From', type: 'date' },
      { name: 'validTo', label: 'Valid To', type: 'date' }
    ],
    postCreateActions: [{ label: 'Mark Issued', method: 'PUT', pathSuffix: '/issue' }]
  }
  */
];

export const getHiringStepById = (stepId: string) => HIRING_STEPS.find((step) => step.id === stepId);
