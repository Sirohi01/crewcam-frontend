import api from '@/lib/axios';

export const createDepartmentKpi = async (data: any) => {
  const response = await api.post('/department-kpis', data);
  return response.data;
};

export const getDepartmentKpis = async (departmentId: string) => {
  const response = await api.get(`/department-kpis/department/${departmentId}`);
  return response.data;
};
