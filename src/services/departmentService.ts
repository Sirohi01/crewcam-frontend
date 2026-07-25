import api from '@/lib/axios';

export interface Department {
  _id: string;
  name: string;
  code: string;
  branchId: any;
  hodEmployeeId?: any;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getDepartments = async (params?: { page?: number; limit?: number; search?: string; branchId?: string }) => {
  const { data } = await api.get('/companies/departments', { params });
  return data.data || [];
};

export const getDepartmentById = async (id: string) => {
  const { data } = await api.get(`/companies/departments/${id}`);
  return data.data || data;
};

export const createDepartment = async (departmentData: any) => {
  const { data } = await api.post('/companies/departments', departmentData);
  return data;
};

export const updateDepartment = async (id: string, departmentData: any) => {
  const { data } = await api.put(`/companies/departments/${id}`, departmentData);
  return data;
};

export const deleteDepartment = async (id: string) => {
  const { data } = await api.delete(`/companies/departments/${id}`);
  return data;
};
