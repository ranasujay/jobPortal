import api from '../utils/api';

// Saved Jobs API calls
export const savedJobsAPI = {
  // Get all saved jobs for current user
  getSavedJobs: async () => {
    const response = await api.get('/api/saved-jobs');
    return response.data.data;
  },

  // Save a job
  saveJob: async (jobId) => {
    const response = await api.post(`/api/saved-jobs/${jobId}`);
    return response.data;
  },

  // Unsave a job
  unsaveJob: async (jobId) => {
    const response = await api.delete(`/api/saved-jobs/${jobId}`);
    return response.data;
  },

  // Check if a job is saved
  checkJobSaved: async (jobId) => {
    const response = await api.get(`/api/saved-jobs/check/${jobId}`);
    return response.data.data.isSaved;
  }
};