import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export const getDirectorates = async () => {
  const response = await api.get('/api/directorates');
  return response.data.data;
};

export const getPrograms = async (directorate) => {
  const response = await api.get('/api/programs', { params: { directorate } });
  return response.data.data;
};

export const registerStudent = async (studentData) => {
  const response = await api.post('/api/register', studentData);
  return response.data;
};

export const adminLogin = async (username, password) => {
  const response = await api.post('/api/admin/login', { username, password });
  return response.data;
};

const getAdminHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return { Authorization: `Bearer ${token}` };
};

export const getAdminStats = async () => {
  const response = await api.get('/api/admin/stats', { headers: getAdminHeaders() });
  return response.data.data;
};

export const getAdminStudents = async () => {
  const response = await api.get('/api/admin/students', { headers: getAdminHeaders() });
  return response.data.data;
};

export const getAdminPrograms = async () => {
  const response = await api.get('/api/admin/programs', { headers: getAdminHeaders() });
  return response.data.data;
};

export const updateAdminProgram = async (id, data) => {
  const response = await api.put(`/api/admin/programs/${id}`, data, { headers: getAdminHeaders() });
  return response.data;
};

export const createAdminProgram = async (data) => {
  const response = await api.post('/api/admin/programs', data, { headers: getAdminHeaders() });
  return response.data;
};

export const deleteAdminProgram = async (id) => {
  const response = await api.delete(`/api/admin/programs/${id}`, { headers: getAdminHeaders() });
  return response.data;
};

export const createAdminDirectorate = async (name) => {
  const response = await api.post('/api/admin/directorates', { name }, { headers: getAdminHeaders() });
  return response.data;
};

export const deleteAdminDirectorate = async (name) => {
  const response = await api.delete(`/api/admin/directorates/${encodeURIComponent(name)}`, { headers: getAdminHeaders() });
  return response.data;
};
