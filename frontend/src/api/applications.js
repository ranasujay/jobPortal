import api from '../utils/api';

const API_BASE_URL = 'http://localhost:5000/api';

// Applications API calls
export const applicationsAPI = {
  // Apply to a job
  applyToJob: async (applicationData) => {
    const formData = new FormData();
    
    // Append basic fields
    formData.append('jobId', applicationData.jobId);
    formData.append('fullName', applicationData.fullName);
    formData.append('email', applicationData.email);
    formData.append('phone', applicationData.phone);
    
    if (applicationData.coverLetterText) {
      formData.append('coverLetterText', applicationData.coverLetterText);
    }
    if (applicationData.additionalInfo) {
      formData.append('additionalInfo', applicationData.additionalInfo);
    }
    
    // Append file fields
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    if (applicationData.coverLetter) {
      formData.append('coverLetter', applicationData.coverLetter);
    }

    const response = await api.post('/api/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user's applications
  getMyApplications: async () => {
    const response = await api.get('/api/applications/my-applications');
    return response.data.data;
  },

  // Withdraw an application
  withdrawApplication: async (applicationId, reason) => {
    const response = await api.patch(`/api/applications/${applicationId}/withdraw`, {
      reason
    });
    return response.data;
  },

  // Get applications for a specific job (recruiter only)
  getJobApplications: async (jobId) => {
    const response = await api.get(`/api/applications/job/${jobId}`);
    return response.data.data;
  },

  // Update application status (recruiter only)
  updateApplicationStatus: async (applicationId, status, notes) => {
    const response = await api.patch(`/api/applications/${applicationId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  // Get application document download link
  getApplicationDocument: async (applicationId, documentType) => {
    const response = await api.get(`/api/applications/${applicationId}/document/${documentType}`);
    return response.data.data;
  },

  // View document in browser (for PDFs and viewable files)
  viewDocument: async (applicationId, documentType) => {
    try {
      // Try the proxy endpoint first (more reliable for authenticated files)
      const token = localStorage.getItem('token');
      const proxyUrl = `${API_BASE_URL}/applications/${applicationId}/document/${documentType}/proxy`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Proxy error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Get the blob and create object URL
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Empty file received');
      }
      
      const blobUrl = URL.createObjectURL(blob);
      
      // Open in new tab
      const newTab = window.open(blobUrl, '_blank');
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      
      if (!newTab) {
        alert('Please allow popups to view documents, or try downloading instead.');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error viewing document:', error);
      alert(`Failed to view document: ${error.message}`);
      throw error;
    }
  },

  // Download document (helper function)
  downloadDocument: async (applicationId, documentType) => {
    try {
      // Use the proxy endpoint for downloads too
      const token = localStorage.getItem('token');
      const downloadUrl = `${API_BASE_URL}/applications/${applicationId}/document/${documentType}/proxy?download=true`;
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Get the blob and trigger download
      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Empty file received for download');
      }
      
      const blobUrl = URL.createObjectURL(blob);
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'document.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading document:', error);
      alert(`Failed to download document: ${error.message}`);
      throw error;
    }
  }
};