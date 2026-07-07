
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Ananya Verma',
    email: 'ananya.verma@email.com',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Digital Marketing Executive',
      code: 'JOB-2026-048'
    },
    experienceYears: 4,
    aiMatchScore: 92,
    topMatchedSkills: ['SEO', 'Google Ads', 'Content Strategy', 'Copywriting', 'Analytics'],
    aiSummary: 'Strong experience in digital marketing with proven SEO and campaign skills.',
    screeningStatus: 'High Match'
  },
  {
    id: 'cand-2',
    name: 'Rohit Singh',
    email: 'rohit.singh@email.com',
    phone: '+91 91234 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Software Developer',
      code: 'JOB-2026-049'
    },
    experienceYears: 3.6,
    aiMatchScore: 78,
    topMatchedSkills: ['Java', 'Spring Boot', 'SQL', 'Hibernate'],
    aiSummary: 'Good technical skills and relevant experience.',
    screeningStatus: 'High Match'
  },
  {
    id: 'cand-3',
    name: 'Pooja Mehta',
    email: 'pooja.mehta@email.com',
    phone: '+91 99887 66554',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'HR Executive',
      code: 'JOB-2026-050'
    },
    experienceYears: 2.5,
    aiMatchScore: 58,
    topMatchedSkills: ['HR', 'Recruitment', 'Employee Relations', 'Onboarding'],
    aiSummary: 'Relevant HR experience but limited in talent acquisition.',
    screeningStatus: 'Medium Match'
  },
  {
    id: 'cand-4',
    name: 'Karan Malhotra',
    email: 'karan.malhotra@email.com',
    phone: '+91 98712 34567',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'UI/UX Designer',
      code: 'JOB-2026-046'
    },
    experienceYears: 2,
    aiMatchScore: 36,
    topMatchedSkills: ['Figma', 'UI Design', 'Adobe XD'],
    aiSummary: 'Limited experience with UI/UX design for similar roles.',
    screeningStatus: 'Low Match'
  },
  {
    id: 'cand-5',
    name: 'Neha Yadav',
    email: 'neha.yadav@email.com',
    phone: '+91 99111 22334',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Business Analyst',
      code: 'JOB-2026-045'
    },
    experienceYears: 1.8,
    aiMatchScore: 72,
    topMatchedSkills: ['Excel', 'SQL', 'Power BI', 'Tableau'],
    aiSummary: 'Good analytical skills and business understanding.',
    screeningStatus: 'High Match'
  },
  {
    id: 'cand-6',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@email.com',
    phone: '+91 98855 66778',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'DevOps Engineer',
      code: 'JOB-2026-044'
    },
    experienceYears: 3.2,
    aiMatchScore: 45,
    topMatchedSkills: ['AWS', 'Docker', 'Jenkins', 'Kubernetes', 'Terraform'],
    aiSummary: 'Some relevant skills but lacks cloud deployment experience.',
    screeningStatus: 'Medium Match'
  },
  {
    id: 'cand-7',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@email.com',
    phone: '+91 91122 33445',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Frontend Developer',
      code: 'JOB-2026-041'
    },
    experienceYears: 5,
    aiMatchScore: 88,
    topMatchedSkills: ['React', 'Tailwind CSS', 'Next.js', 'Redux', 'Webpack'],
    aiSummary: 'Outstanding frontend portfolio with deep React and Tailwind expertise.',
    screeningStatus: 'High Match'
  },
  {
    id: 'cand-8',
    name: 'Meera Nair',
    email: 'meera.nair@email.com',
    phone: '+91 92233 44556',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Data Scientist',
      code: 'JOB-2026-042'
    },
    experienceYears: 4.5,
    aiMatchScore: 81,
    topMatchedSkills: ['Python', 'PyTorch', 'SQL', 'Pandas', 'Machine Learning'],
    aiSummary: 'High-level ML expertise with solid statistical modeling skills.',
    screeningStatus: 'High Match'
  },
  {
    id: 'cand-9',
    name: 'Kunal Shah',
    email: 'kunal.shah@email.com',
    phone: '+91 93344 55667',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Product Manager',
      code: 'JOB-2026-043'
    },
    experienceYears: 6,
    aiMatchScore: 62,
    topMatchedSkills: ['Agile', 'Product Roadmap', 'Jira', 'SQL'],
    aiSummary: 'Solid product background but limited industry-specific experience.',
    screeningStatus: 'Medium Match'
  },
  {
    id: 'cand-10',
    name: 'Aditi Rao',
    email: 'aditi.rao@email.com',
    phone: '+91 94455 66778',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Mobile Developer',
      code: 'JOB-2026-047'
    },
    experienceYears: 1.5,
    aiMatchScore: 39,
    topMatchedSkills: ['Flutter', 'Dart', 'iOS', 'Android'],
    aiSummary: 'Eager junior dev, but lacks depth in native platform performance.',
    screeningStatus: 'Low Match'
  },
  {
    id: 'cand-11',
    name: 'Siddharth Patel',
    email: 'siddharth.patel@email.com',
    phone: '+91 95566 77889',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    jobAppliedFor: {
      title: 'Security Engineer',
      code: 'JOB-2026-051'
    },
    experienceYears: 3,
    aiMatchScore: 15,
    topMatchedSkills: ['Penetration Testing', 'OWASP', 'Cryptography', 'Network Security'],
    aiSummary: 'Background in systems but flagged due to security screening check fail.',
    screeningStatus: 'Needs Review'
  }
];

export const INITIAL_METRIC_CARDS: MetricCardData[] = [
  {
    id: 'resumes',
    title: 'Resumes Screened',
    value: 142,
    subtext: 'This Week',
    changeText: '▲ 24.6% from last week',
    colorClass: 'bg-violet-50/70',
    borderColorClass: 'border-violet-100',
    textColorClass: 'text-violet-900',
    numColorClass: 'text-violet-950',
    iconName: 'resume'
  },
  {
    id: 'high',
    title: 'High Match',
    value: 96,
    subtext: '(70% and above)',
    changeText: '67.6% of screened',
    colorClass: 'bg-emerald-50/70',
    borderColorClass: 'border-emerald-100',
    textColorClass: 'text-emerald-900',
    numColorClass: 'text-emerald-950',
    iconName: 'high'
  },
  {
    id: 'medium',
    title: 'Medium Match',
    value: 28,
    subtext: '(40% - 69%)',
    changeText: '19.7% of screened',
    colorClass: 'bg-blue-50/70',
    borderColorClass: 'border-blue-100',
    textColorClass: 'text-blue-900',
    numColorClass: 'text-blue-950',
    iconName: 'medium'
  },
  {
    id: 'low',
    title: 'Low Match',
    value: 18,
    subtext: '(Below 40%)',
    changeText: '12.7% of screened',
    colorClass: 'bg-amber-50/70',
    borderColorClass: 'border-amber-100',
    textColorClass: 'text-amber-900',
    numColorClass: 'text-amber-950',
    iconName: 'low'
  },
  {
    id: 'review',
    title: 'Needs Review',
    value: 4,
    subtext: '(AI Flagged)',
    changeText: '2.8% of screened',
    colorClass: 'bg-rose-50/70',
    borderColorClass: 'border-rose-100',
    textColorClass: 'text-rose-900',
    numColorClass: 'text-rose-950',
    iconName: 'review'
  }
];

export const UNIQUE_JOBS = [
  'All Openings',
  'Digital Marketing Executive',
  'Software Developer',
  'HR Executive',
  'UI/UX Designer',
  'Business Analyst',
  'DevOps Engineer',
  'Frontend Developer',
  'Data Scientist',
  'Product Manager',
  'Mobile Developer',
  'Security Engineer'
];

export const UNIQUE_DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Design',
  'Marketing',
  'Human Resources',
  'Product',
  'Data Science',
  'Security'
];

export const UNIQUE_EXPERIENCES = [
  'All Experience',
  'Under 2 Years',
  '2 - 4 Years',
  'Above 4 Years'
];

export const UNIQUE_SCORES = [
  'All Scores',
  'Excellent (85%+)',
  'Good (70%-84%)',
  'Average (40%-69%)',
  'Low (Below 40%)'
];

export const UNIQUE_STATUSES = [
  'All Status',
  'High Match',
  'Medium Match',
  'Low Match',
  'Needs Review'
];


export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  jobAppliedFor: {
    title: string;
    code: string;
  };
  experienceYears: number;
  aiMatchScore: number; // 0 to 100
  topMatchedSkills: string[];
  aiSummary: string;
  screeningStatus: 'High Match' | 'Medium Match' | 'Low Match' | 'Needs Review';
  actionStatus?: string;
  checked?: boolean;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: number;
  subtext: string;
  changeText: string;
  colorClass: string;
  borderColorClass: string;
  textColorClass: string;
  numColorClass: string;
  iconName: 'resume' | 'high' | 'medium' | 'low' | 'review';
}

export interface FilterState {
  searchQuery: string;
  jobOpening: string;
  department: string;
  experience: string;
  aiMatchScore: string;
  screeningStatus: string;
  dateRange: string;
}

export interface ScreeningFactors {
  skillsMatch: boolean;
  experience: boolean;
  education: boolean;
  jobTitleRelevance: boolean;
  keywords: boolean;
}
