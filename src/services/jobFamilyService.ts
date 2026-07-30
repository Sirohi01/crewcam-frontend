import api from '@/lib/axios';

export interface JobFamily {
  _id: string;
  name: string;
  code: string;
  description?: string;
  parentFamilyId?: any;
  businessUnit?: string;
  keyResponsibilities?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getJobFamilies = async (params?: { page?: number; limit?: number; search?: string }) => {
  const { data } = await api.get('/companies/job-families', { params });
  return data;
};

export const getJobFamilyById = async (id: string) => {
  const { data } = await api.get(`/companies/job-families/${id}`);
  return data.data || data;
};

export const createJobFamily = async (jobFamilyData: any) => {
  const { data } = await api.post('/companies/job-families', jobFamilyData);
  return data;
};

export const updateJobFamily = async (id: string, jobFamilyData: any) => {
  const { data } = await api.put(`/companies/job-families/${id}`, jobFamilyData);
  return data;
};

export const deleteJobFamily = async (id: string) => {
  const { data } = await api.delete(`/companies/job-families/${id}`);
  return data;
};
