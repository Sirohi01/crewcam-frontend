import api from '@/lib/axios';

/** Employee self-service — backend /api/v1/me (Phase 1). Always the signed-in employee. */

export interface MyProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode?: string;
  designation?: string;
  mobileNumber?: string;
  profilePictureUrl?: string;
  dateOfJoining?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  maritalStatus?: string;
  currentAddress?: string;
  currentCity?: string;
  currentState?: string;
  currentPincode?: string;
  permanentAddress?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  uanNumber?: string;
  employmentStatus?: 'active' | 'ex';
  isActive?: boolean;
  roleId?: { _id: string; name: string };
  branchId?: { _id: string; name: string; address?: string; location?: string };
  departmentId?: { _id: string; name: string };
  designationId?: { _id: string; name: string };
  reportingToId?: { _id: string; firstName: string; lastName: string; email?: string; profilePictureUrl?: string; designation?: string };
}

export interface FamilyMember {
  _id?: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  mobile?: string;
  email?: string;
  isDependent: boolean;
}

export interface EmergencyContact {
  _id?: string;
  name: string;
  relationship: string;
  mobile: string;
  alternateMobile?: string;
  address?: string;
  isPrimary: boolean;
}

export interface FamilyInfo {
  familyStatus?: string;
  spouseName?: string;
  marriageAnniversary?: string;
  familyAddress?: string;
  medicalHistory?: string;
  nomineeName?: string;
  nomineeRelationship?: string;
}

export interface EducationEntry {
  _id?: string;
  qualification: string;
  institution: string;
  board?: string;
  yearOfPassing?: number;
  score?: string;
  mode?: 'Full-Time' | 'Part-Time' | 'Distance' | 'Online';
  specialization?: string;
}

export interface CertificationEntry {
  _id?: string;
  name: string;
  issuedBy?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface CourseEntry {
  _id?: string;
  name: string;
  provider?: string;
  year?: number;
  duration?: string;
}

export interface ExperienceEntry {
  _id?: string;
  company: string;
  designation: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  employmentType?: string;
  responsibilities?: string;
}

export interface SkillEntry {
  _id?: string;
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

export interface MyDetails {
  familyMembers: FamilyMember[];
  emergencyContacts: EmergencyContact[];
  familyInfo: FamilyInfo;
  education: EducationEntry[];
  certifications: CertificationEntry[];
  courses: CourseEntry[];
  experience: ExperienceEntry[];
  skills: SkillEntry[];
}

export type DetailsSection = keyof MyDetails;

export interface MyBankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string; // masked by the server, e.g. XXXXXX1234
  ifscCode: string;
  micrCode?: string;
  branchName?: string;
  accountType?: string;
  status?: string;
  updatedAt?: string;
}

export const getMyProfile = async (): Promise<MyProfile> => (await api.get('/me/profile')).data.data;

export const updateMyProfile = async (data: Partial<MyProfile>): Promise<MyProfile> =>
  (await api.patch('/me/profile', data)).data.data;

export const getMyDetails = async (): Promise<MyDetails> => (await api.get('/me/details')).data.data;

export const saveMyDetailsSection = async <S extends DetailsSection>(section: S, value: MyDetails[S]): Promise<MyDetails> =>
  (await api.put(`/me/details/${section}`, { [section]: value })).data.data;

export const getMyBankDetails = async (): Promise<MyBankDetails | null> => (await api.get('/me/bank')).data.data;
