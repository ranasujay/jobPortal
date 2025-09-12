import api from '../utils/api';

// Jobs API calls
export const jobsAPI = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.location) params.append('location', filters.location);
    if (filters.company) params.append('company', filters.company);
    if (filters.search) params.append('search', filters.search);
    if (filters.job_type) params.append('job_type', filters.job_type);
    if (filters.experience_level) params.append('experience_level', filters.experience_level);

    const response = await api.get(`/api/jobs?${params}`);
    return response.data.data;
  },

  // Get single job by ID
  getJob: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data.data;
  },

  // Create new job (recruiter only)
  createJob: async (jobData) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data.data;
  },

  // Update job (recruiter only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/api/jobs/${jobId}`, jobData);
    return response.data.data;
  },

  // Delete job (recruiter only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response.data;
  },

  // Get jobs posted by current recruiter
  getMyJobs: async () => {
    const response = await api.get('/api/jobs/my-jobs');
    return response.data.data;
  },

  // Update job hiring status
  updateHiringStatus: async (jobId, isOpen) => {
    const response = await api.patch(`/api/jobs/${jobId}/status`, { isOpen });
    return response.data.data;
  },

  // Apply to a job
  applyToJob: async (applicationData) => {
    const formData = new FormData();
    
    // Append all fields to FormData
    Object.keys(applicationData).forEach(key => {
      if (key === 'resume') {
        formData.append(key, applicationData[key]);
      } else {
        formData.append(key, applicationData[key]);
      }
    });

    const response = await api.post('/api/jobs/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get applications for a specific job (recruiter only)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/api/jobs/${jobId}/applications`);
    return response.data.data;
  },

  // Update application status (recruiter only)
  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.patch(`/api/applications/${applicationId}/status`, { status });
    return response.data.data;
  },
};