export type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';

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
      { name: 'comments', label: 'Comments', type: 'textarea' },
    ]
  },
  {
    id: 'joining-form', stepKey: 'joiningForm', step: 9, phase: 'Onboarding', title: 'Employee Joining Form',
    apiPath: '/hiring/joining-form', entityField: 'candidateId', hasPdf: true,
    fields: [
      // Personal Details
      { name: 'personalDetails.fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'personalDetails.dob', label: 'Date of Birth', type: 'date', required: true },
      { name: 'personalDetails.gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { name: 'personalDetails.bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'personalDetails.maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
      { name: 'personalDetails.nationality', label: 'Nationality', type: 'text' },
      { name: 'personalDetails.fatherMotherName', label: "Father's / Mother's Name", type: 'text' },
      // Contact Details
      { name: 'contactDetails.mobileNumber', label: 'Mobile Number', type: 'text', required: true },
      { name: 'contactDetails.alternateNumber', label: 'Alternate Number', type: 'text' },
      { name: 'contactDetails.personalEmail', label: 'Personal Email', type: 'text' },
      { name: 'contactDetails.currentAddress', label: 'Current Address', type: 'textarea' },
      { name: 'contactDetails.permanentAddress', label: 'Permanent Address', type: 'textarea' },
      // Position
      { name: 'positionDetails.designation', label: 'Designation', type: 'text', required: true },
      { name: 'positionDetails.department', label: 'Department', type: 'text', required: true },
      { name: 'positionDetails.joiningDate', label: 'Joining Date', type: 'date', required: true },
      { name: 'positionDetails.reportingManager', label: 'Reporting Manager', type: 'text' },
      { name: 'positionDetails.workLocation', label: 'Work Location', type: 'text' },
      { name: 'positionDetails.employeeCategory', label: 'Employee Category', type: 'select', options: ['Permanent', 'Contract', 'Probation', 'Intern'] },
      { name: 'positionDetails.empCode', label: 'Employee Code', type: 'text' },
      // Identification
      { name: 'identificationDetails.aadhaarNumber', label: 'Aadhaar Number', type: 'text' },
      { name: 'identificationDetails.panNumber', label: 'PAN Number', type: 'text' },
      { name: 'identificationDetails.drivingLicense', label: 'Driving License', type: 'text' },
      { name: 'identificationDetails.passportNumber', label: 'Passport Number', type: 'text' },
      { name: 'identificationDetails.uanNumber', label: 'UAN Number', type: 'text' },
      // Emergency Contact
      { name: 'emergencyContact.name', label: 'Emergency Contact Name', type: 'text' },
      { name: 'emergencyContact.relationship', label: 'Emergency Relationship', type: 'text' },
      { name: 'emergencyContact.mobileNumber', label: 'Emergency Mobile', type: 'text' },
      { name: 'emergencyContact.address', label: 'Emergency Address', type: 'textarea' },
      // Operational
      { name: 'operationalDetails.weeklyOff', label: 'Weekly Off', type: 'text' },
      { name: 'operationalDetails.shift', label: 'Shift', type: 'text' },
      { name: 'operationalDetails.dutyTimingFrom', label: 'Duty From', type: 'text' },
      { name: 'operationalDetails.dutyTimingTo', label: 'Duty To', type: 'text' },
      // Declaration
      { name: 'declaration.hrVerifiedBy', label: 'HR Verified By', type: 'text' },
      { name: 'declaration.hrRemarks', label: 'HR Remarks', type: 'textarea' },
    ],
    arrayFields: [
      {
        name: 'educationDetails', label: 'Education Details', subFields: [
          { name: 'qualification', label: 'Qualification', type: 'text', required: true },
          { name: 'institution', label: 'Institution', type: 'text' },
          { name: 'yearOfPassing', label: 'Year of Passing', type: 'text' },
          { name: 'percentage', label: 'Percentage / CGPA', type: 'text' },
        ]
      },
      {
        name: 'previousEmployment', label: 'Previous Employment', subFields: [
          { name: 'companyName', label: 'Company Name', type: 'text', required: true },
          { name: 'designation', label: 'Designation', type: 'text' },
          { name: 'fromDate', label: 'From Date', type: 'date' },
          { name: 'toDate', label: 'To Date', type: 'date' },
          { name: 'lastSalary', label: 'Last Salary', type: 'text' },
          { name: 'reasonForLeaving', label: 'Reason for Leaving', type: 'text' },
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
    fields: [
      { name: 'nominationType', label: 'Nomination Type', type: 'select', options: ['PF', 'Gratuity', 'Insurance'], required: true },
      { name: 'declarationDate', label: 'Declaration Date', type: 'date' },
      { name: 'declarationPlace', label: 'Declaration Place', type: 'text' },
      { name: 'witnessName', label: 'Witness Name', type: 'text' },
      { name: 'witnessDesignation', label: 'Witness Designation', type: 'text' },
    ],
    arrayFields: [
      {
        name: 'nominees', label: 'Nominees', subFields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'relationship', label: 'Relationship', type: 'text', required: true },
          { name: 'dob', label: 'Date of Birth', type: 'date' },
          { name: 'sharePercentage', label: 'Share %', type: 'number', required: true },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'isMinor', label: 'Is Minor', type: 'select', options: ['false', 'true'] },
          { name: 'guardianName', label: 'Guardian Name', type: 'text' },
          { name: 'guardianRelationship', label: 'Guardian Relationship', type: 'text' },
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
    fields: [
      { name: 'bankName', label: 'Bank Name', type: 'text', required: true },
      { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', required: true },
      { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
      { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
      { name: 'branchName', label: 'Branch Name', type: 'text' },
      { name: 'accountType', label: 'Account Type', type: 'select', options: ['Savings', 'Current'] },
      { name: 'micrCode', label: 'MICR Code', type: 'text' },
      { name: 'panNumber', label: 'PAN Number', type: 'text' },
      { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text' },
      { name: 'uanNumber', label: 'UAN Number', type: 'text' },
      { name: 'pfAccountNumber', label: 'PF Account Number', type: 'text' },
      { name: 'esiNumber', label: 'ESI Number', type: 'text' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Bank Transfer', 'Cheque', 'Cash'] },
      { name: 'pfApplicable', label: 'PF Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'esiApplicable', label: 'ESI Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'ptApplicable', label: 'Professional Tax Applicable', type: 'select', options: ['true', 'false'] },
      { name: 'hrVerifiedBy', label: 'HR Verified By', type: 'text' },
      { name: 'hrRemarks', label: 'HR Remarks', type: 'textarea' },
    ],
    postCreateActions: [
      { label: 'Verify Bank Details', method: 'PUT', pathSuffix: '/verify', payload: {} },
    ]
  },
  {
    id: 'emergency-contact', stepKey: 'emergencyContact', step: 12, phase: 'Onboarding', title: 'Emergency Contact Details',
    apiPath: '/hiring/emergency-contact', entityField: 'candidateId',
    fields: [
      // Medical Info
      { name: 'medicalInfo.bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'medicalInfo.knownAllergies', label: 'Known Allergies', type: 'textarea' },
      { name: 'medicalInfo.chronicConditions', label: 'Chronic Conditions', type: 'textarea' },
      { name: 'medicalInfo.currentMedications', label: 'Current Medications', type: 'text' },
      { name: 'medicalInfo.doctorName', label: "Doctor's Name", type: 'text' },
      { name: 'medicalInfo.doctorPhone', label: "Doctor's Phone", type: 'text' },
      { name: 'medicalInfo.hospitalPreference', label: 'Preferred Hospital', type: 'text' },
      { name: 'medicalInfo.insurancePolicyNumber', label: 'Insurance Policy No.', type: 'text' },
    ],
    arrayFields: [
      {
        name: 'contacts', label: 'Emergency Contacts', subFields: [
          { name: 'isPrimary', label: 'Primary Contact', type: 'select', options: ['true', 'false'] },
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'relationship', label: 'Relationship', type: 'text', required: true },
          { name: 'phone', label: 'Phone', type: 'text', required: true },
          { name: 'alternatePhone', label: 'Alternate Phone', type: 'text' },
          { name: 'email', label: 'Email', type: 'text' },
          { name: 'address', label: 'Address', type: 'text' },
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
    apiPath: '/hiring/it-policy-accept', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'policyVersion', label: 'Policy Version', type: 'text' },
      { name: 'policyTitle', label: 'Policy Title', type: 'text' },
      { name: 'signerName', label: 'Signer Name', type: 'text', required: true },
      { name: 'signerDesignation', label: 'Signer Designation', type: 'text' },
      { name: 'policyContentSnapshot', label: 'Policy Content (snapshot)', type: 'textarea' },
    ]
  },
  {
    id: 'code-of-conduct-accept', stepKey: 'conductAcceptance', step: 16, phase: 'Onboarding', title: 'Code of Conduct Acceptance',
    apiPath: '/hiring/code-of-conduct-accept', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'version', label: 'Conduct Policy Version', type: 'text' },
      { name: 'conductTitle', label: 'Conduct Title', type: 'text' },
      { name: 'signerName', label: 'Signer Name', type: 'text', required: true },
      { name: 'signerDesignation', label: 'Signer Designation', type: 'text' },
      { name: 'conductContentSnapshot', label: 'Conduct Content (snapshot)', type: 'textarea' },
    ]
  },
  {
    id: 'appointment-letter', stepKey: 'appointmentLetter', step: 17, phase: 'Offer & Legal', title: 'Appointment Letter',
    apiPath: '/hiring/appointment-letter', entityField: 'candidateId', hasPdf: true,
    fields: [
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'departmentName', label: 'Department', type: 'text' },
      { name: 'reportingTo', label: 'Reporting To', type: 'text' },
      { name: 'workLocation', label: 'Work Location', type: 'text' },
      { name: 'joiningDate', label: 'Joining Date', type: 'date' },
      { name: 'probationPeriodMonths', label: 'Probation Period (months)', type: 'number' },
      { name: 'ctc', label: 'Annual CTC (₹)', type: 'number' },
      { name: 'ctcInWords', label: 'CTC In Words', type: 'text' },
      { name: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Bank Transfer', 'Cheque', 'Cash'] },
      { name: 'workingHours', label: 'Working Hours', type: 'text' },
      { name: 'workingDays', label: 'Working Days', type: 'text' },
      { name: 'weeklyOff', label: 'Weekly Off', type: 'text' },
      { name: 'letterContent', label: 'Letter Content', type: 'textarea' },
    ],
    postCreateActions: [{ label: 'Acknowledge Appointment', method: 'PUT', pathSuffix: '/acknowledge' }]
  },
  {
    id: 'asset-access', stepKey: 'assetAccessForm', step: 18, phase: 'Onboarding', title: 'IT Assets, Access & Stationery',
    apiPath: '/hiring/asset-access', entityField: 'candidateId',
    fields: [],
    arrayFields: [
      {
        name: 'assetsIssued', label: 'Assets Issued', subFields: [
          { name: 'assetType', label: 'Asset Type', type: 'text', required: true },
          { name: 'assetTag', label: 'Asset Tag', type: 'text' },
          { name: 'serialNumber', label: 'Serial Number', type: 'text' }
        ]
      },
      {
        name: 'accessGranted', label: 'Access Granted', subFields: [
          { name: 'systemName', label: 'System', type: 'text', required: true },
          { name: 'accessLevel', label: 'Access Level', type: 'text' }
        ]
      },
      {
        name: 'stationeryIssued', label: 'Stationery Issued', subFields: [
          { name: 'item', label: 'Item', type: 'text', required: true },
          { name: 'quantity', label: 'Quantity', type: 'number' }
        ]
      }
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
      {
        name: 'modules', label: 'Induction Modules', subFields: [
          { name: 'moduleName', label: 'Module Name', type: 'text', required: true }
        ]
      }
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
      {
        name: 'teamMembers', label: 'Team Members', subFields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'designation', label: 'Designation', type: 'text' }
        ]
      }
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
      {
        name: 'ratings', label: 'Ratings', subFields: [
          { name: 'parameter', label: 'Parameter', type: 'text', required: true },
          { name: 'score', label: 'Score (1-5)', type: 'number', required: true }
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
    apiPath: '/hiring/perf-eval', entityField: 'employeeId',
    fields: [
      { name: 'evaluationPeriod', label: 'Evaluation Period', type: 'text' },
      { name: 'strengths', label: 'Strengths', type: 'textarea' },
      { name: 'areasOfImprovement', label: 'Areas of Improvement', type: 'textarea' },
      { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Confirm', 'Extend Probation', 'PIP', 'Terminate'] }
    ],
    arrayFields: [
      {
        name: 'kpis', label: 'KPIs', subFields: [
          { name: 'metric', label: 'Metric', type: 'text', required: true },
          { name: 'score', label: 'Score (1-5)', type: 'number', required: true }
        ]
      }
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
  },
  {
    id: 'release-qa', stepKey: 'releaseQA', step: 25, phase: 'Post-Joining', title: 'Release QA Checks',
    apiPath: '/hiring/release-qa', entityField: 'employeeId',
    fields: [
      { name: 'qaStatus', label: 'QA Status', type: 'select', options: ['Pending', 'Passed', 'Failed'] },
      { name: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  }
];

export const getHiringStepById = (stepId: string) => HIRING_STEPS.find((step) => step.id === stepId);
