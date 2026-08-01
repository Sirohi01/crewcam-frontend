import api from '@/lib/axios';

export interface CompanyProfile {
  _id: string;
  name: string;
  legalName: string;
  companyCode: string;
  businessType: string;
  industry: string;
  panNumber: string;
  gstNumber: string;
  website: string;
  establishedDate: string;
  companySize: string;
  address: {
    registeredOffice: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  contact: {
    phone: string;
    email: string;
    hrEmail: string;
  };
  description: string;
  mission: string;
  vision: string;
  logo: string;
  coverImage: string;
  lifecycleStatus: string;
  modules: string[];
  documents: Array<{
    name: string;
    date: string;
    url: string;
  }>;
  stats: {
    totalEmployees: number;
    departments: number;
    locations: number;
    activePositions: number;
  };
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const { data } = await api.get('/companies/me');
  return data.data || data;
}

export async function getCompanyProfileById(id: string): Promise<CompanyProfile> {
  const { data } = await api.get(`/companies/${id}`);
  return data.data || data;
}