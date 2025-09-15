import api from '../utils/api';

// Profile API calls
export const profileAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    const formData = new FormData();
    
    // Add all profile fields to FormData
    Object.keys(profileData).forEach(key => {
      if (key === 'avatar' && profileData[key]) {
        formData.append('avatar', profileData[key]);
      } else if (key === 'skills' || key === 'portfolio_links') {
        // Handle arrays
        formData.append(key, JSON.stringify(profileData[key]));
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    const response = await api.put('/api/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user profile (already exists in auth API)
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};