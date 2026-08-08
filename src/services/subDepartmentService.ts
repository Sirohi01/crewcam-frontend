import api from '@/lib/axios';

export interface SubDepartment {
  _id: string;
  name: string;
  code: string;
  shortName?: string;
  description?: string;
  parentDepartmentId: any;
  reportingToId?: any;
  businessUnit?: string;
  costCenter?: string;
  location?: string;
  isActive: boolean;
  effectiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const getSubDepartments = async (params?: { page?: number; limit?: number; search?: string; parentDepartmentId?: string }) => {
  const { data } = await api.get('/companies/sub-departments', { params });
  return data.data || [];
};

export const getSubDepartmentById = async (id: string) => {
  const { data } = await api.get(`/companies/sub-departments/${id}`);
  return data.data || data;
};

export const createSubDepartment = async (subDepartmentData: any) => {
  const { data } = await api.post('/companies/sub-departments', subDepartmentData);
  return data;
};

export const updateSubDepartment = async (id: string, subDepartmentData: any) => {
  const { data } = await api.put(`/companies/sub-departments/${id}`, subDepartmentData);
  return data;
};

export const deleteSubDepartment = async (id: string) => {
  const { data } = await api.delete(`/companies/sub-departments/${id}`);
  return data;
};
