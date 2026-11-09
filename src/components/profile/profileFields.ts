import type { EntryField } from './ProfileEntryDialog';

/** Form definitions for the My Profile sections. Rules mirror the /me Zod schemas. */

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const FAMILY_FIELDS: EntryField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'relationship', label: 'Relationship', type: 'text', required: true, placeholder: 'e.g. Father' },
  { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
  { key: 'gender', label: 'Gender', type: 'select', options: GENDER_OPTIONS },
  { key: 'occupation', label: 'Occupation', type: 'text' },
  { key: 'mobile', label: 'Mobile Number', type: 'tel' },
  { key: 'email', label: 'Email ID', type: 'email' },
  { key: 'isDependent', label: 'Dependent (considered for insurance and tax benefits)', type: 'checkbox' },
];

export const EMERGENCY_FIELDS: EntryField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'relationship', label: 'Relationship', type: 'text', required: true },
  { key: 'mobile', label: 'Mobile No.', type: 'tel', required: true },
  { key: 'alternateMobile', label: 'Alternate No.', type: 'tel' },
  { key: 'address', label: 'Address', type: 'textarea' },
  { key: 'isPrimary', label: 'Primary contact', type: 'checkbox' },
];

export const FAMILY_INFO_FIELDS: EntryField[] = [
  { key: 'familyStatus', label: 'Family Status', type: 'select', options: [
    { value: 'Nuclear Family', label: 'Nuclear Family' },
    { value: 'Joint Family', label: 'Joint Family' },
    { value: 'Single', label: 'Single' },
  ] },
  { key: 'spouseName', label: 'Spouse Name', type: 'text' },
  { key: 'marriageAnniversary', label: 'Marriage Anniversary', type: 'date' },
  { key: 'nomineeName', label: 'Nominee for PF / ESIC', type: 'text' },
  { key: 'nomineeRelationship', label: 'Nominee Relationship', type: 'text' },
  { key: 'familyAddress', label: 'Family Address', type: 'textarea' },
  { key: 'medicalHistory', label: 'Family Medical History', type: 'textarea' },
];

const MODE_OPTIONS = ['Full-Time', 'Part-Time', 'Distance', 'Online'].map((m) => ({ value: m, label: m }));

export const EDUCATION_FIELDS: EntryField[] = [
  { key: 'qualification', label: 'Qualification', type: 'text', required: true, placeholder: 'e.g. B.Tech' },
  { key: 'institution', label: 'Institute / University', type: 'text', required: true },
  { key: 'board', label: 'Board / University', type: 'text' },
  { key: 'yearOfPassing', label: 'Year of Passing', type: 'number' },
  { key: 'score', label: 'Percentage / CGPA', type: 'text' },
  { key: 'mode', label: 'Mode', type: 'select', options: MODE_OPTIONS },
  { key: 'specialization', label: 'Specialization', type: 'text' },
];

export const CERTIFICATION_FIELDS: EntryField[] = [
  { key: 'name', label: 'Certification Name', type: 'text', required: true },
  { key: 'issuedBy', label: 'Issued By', type: 'text' },
  { key: 'issueDate', label: 'Issue Date', type: 'date' },
  { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
  { key: 'credentialId', label: 'Credential ID', type: 'text' },
];

export const EXPERIENCE_FIELDS: EntryField[] = [
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'designation', label: 'Designation / Role', type: 'text', required: true },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date (leave blank if current)', type: 'date' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'].map((v) => ({ value: v, label: v })) },
  { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. IT Services' },
  { key: 'companyWebsite', label: 'Company Website', type: 'text' },
  { key: 'responsibilities', label: 'Key Responsibilities (one per line)', type: 'textarea' },
  { key: 'referenceName', label: 'Reference Name', type: 'text' },
  { key: 'referencePhone', label: 'Reference Phone', type: 'tel' },
  { key: 'referenceEmail', label: 'Reference Email', type: 'email' },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((v) => ({ value: v, label: v }));

/** The only User fields an employee may change themselves (PATCH /me/profile). */
export const PROFILE_FIELDS: EntryField[] = [
  { key: 'mobileNumber', label: 'Mobile Number', type: 'tel' },
  { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: BLOOD_GROUPS },
  { key: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['single', 'married', 'divorced', 'widowed'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
  { key: 'currentAddress', label: 'Current Address', type: 'textarea' },
  { key: 'currentCity', label: 'Current City', type: 'text' },
  { key: 'currentState', label: 'Current State', type: 'text' },
  { key: 'currentPincode', label: 'Current Pincode', type: 'text' },
  { key: 'permanentAddress', label: 'Permanent Address', type: 'textarea' },
];

export const SKILL_FIELDS: EntryField[] = [
  { key: 'name', label: 'Skill Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', options: ['Core Skill', 'Soft Skill', 'Technical Skill'].map((v) => ({ value: v, label: v })) },
  { key: 'level', label: 'Proficiency', type: 'select', options: [
    { value: 'Beginner', label: 'Beginner (25%)' },
    { value: 'Intermediate', label: 'Intermediate (50%)' },
    { value: 'Advanced', label: 'Advanced (75%)' },
    { value: 'Expert', label: 'Expert (100%)' },
  ] },
  { key: 'yearsOfExperience', label: 'Years of Experience', type: 'number' },
];

export const COURSE_FIELDS: EntryField[] = [
  { key: 'name', label: 'Course / Workshop', type: 'text', required: true },
  { key: 'provider', label: 'Institute / Provider', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 months' },
];
