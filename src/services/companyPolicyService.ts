import api from '@/lib/axios';

export const createCompanyPolicy = async (payload: any) => {
  const response = await api.post('/company-policies', payload);
  return response.data;
};

export const getCompanyPolicies = async (filters: any = {}) => {
  const response = await api.get('/company-policies', { params: filters });
  return response.data;
};

export const getCompanyPolicyById = async (id: string) => {
  const response = await api.get(`/company-policies/${id}`);
  return response.data;
};

export const updateCompanyPolicy = async (id: string, payload: any) => {
  const response = await api.put(`/company-policies/${id}`, payload);
  return response.data;
};

export const deleteCompanyPolicy = async (id: string) => {
  const response = await api.delete(`/company-policies/${id}`);
  return response.data;
};
