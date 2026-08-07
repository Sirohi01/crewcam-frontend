import api from '@/lib/axios';

export const createCustomField = async (data: any) => {
  const response = await api.post('/custom-fields', data);
  return response.data;
};

export const getDepartmentCustomFields = async (departmentId: string) => {
  const response = await api.get(`/custom-fields/department/${departmentId}`);
  return response.data;
};

export const deleteCustomField = async (id: string) => {
  const response = await api.delete(`/custom-fields/${id}`);
  return response.data;
};

export const getCustomFieldById = async (id: string) => {
  const response = await api.get(`/custom-fields/field/${id}`);
  return response.data;
};

export const updateCustomField = async (id: string, data: any) => {
  const response = await api.put(`/custom-fields/${id}`, data);
  return response.data;
};
