import api from '@/lib/axios';

export const createDepartmentKpi = async (data: any) => {
  const response = await api.post('/department-kpis', data);
  return response.data;
};

export const getDepartmentKpis = async (departmentId: string) => {
  const response = await api.get(`/department-kpis/department/${departmentId}`);
  return response.data;
};

export const getDepartmentKpiById = async (id: string) => {
  const response = await api.get(`/department-kpis/${id}`);
  return response.data;
};

export const updateDepartmentKpi = async (id: string, data: any) => {
  const response = await api.put(`/department-kpis/${id}`, data);
  return response.data;
};
