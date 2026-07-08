

export interface CandidateInfo {
  fullName: string;
  email: string;
  mobile: string;
  currentLocation: string;
  preferredLocation: string;
  linkedin: string;
  appliedFor: string;
  department: string;
  employmentType: string;
  totalExperience: string; // e.g. "7"
  relevantExperience: string; // e.g. "7"
  currentCompany: string;
  currentCTC: string; // e.g. "8.50 LPA"
  expectedCTC: string; // e.g. "12.00 LPA"
  noticePeriod: string; // e.g. "30 Days"
  availableFrom: string; // e.g. "15 June 2026"
  relocation: string; // e.g. "Yes, I am open to relocate"
  willingToTravel: string; // e.g. "Yes"
  highestQualification: string; // e.g. "MBA - Marketing"
  university: string; // e.g. "Amity University, Noida"
  yearOfPassing: string; // e.g. "2017"
  cgpa: string; // e.g. "7.8 CGPA"
}

export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export interface Skill {
  name: string;
  category: 'matched' | 'missing';
  percentage?: number;
}

export interface TimelineEvent {
  title: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
  description?: string;
}

export type PortalView = 'review' | 'submitted' | 'evaluation';
