import api from '../utils/api';

// Companies API calls
export const companiesAPI = {
  // Get all companies
  getCompanies: async () => {
    const response = await api.get('/api/companies');
    return response.data.data;
  },

  // Get single company by ID
  getCompany: async (companyId) => {
    const response = await api.get(`/api/companies/${companyId}`);
    return response.data.data;
  },

  // Create new company (admin/recruiter only)
  createCompany: async (companyData) => {
    const response = await api.post('/api/companies', companyData);
    return response.data.data;
  },

  // Update company (admin/recruiter only)
  updateCompany: async (companyId, companyData) => {
    const response = await api.put(`/api/companies/${companyId}`, companyData);
    return response.data.data;
  },

  // Delete company (admin only)
  deleteCompany: async (companyId) => {
    const response = await api.delete(`/api/companies/${companyId}`);
    return response.data;
  },

  // Get current user's company
  getMyCompany: async () => {
    const response = await api.get('/api/companies/my-company');
    return response.data.data;
  },

  // Get current user's companies (all companies owned by user)
  getMyCompanies: async () => {
    const response = await api.get('/api/companies/my-companies');
    return response.data.data;
  },
};