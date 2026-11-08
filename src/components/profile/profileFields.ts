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

export const COURSE_FIELDS: EntryField[] = [
  { key: 'name', label: 'Course / Workshop', type: 'text', required: true },
  { key: 'provider', label: 'Institute / Provider', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 3 months' },
];
