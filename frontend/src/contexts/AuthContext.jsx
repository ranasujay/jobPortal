import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    try {
      const response = await api.get('/api/auth/me');
      const { user: userData } = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, keep current user data
    }
  };

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        // Refresh user data from server to get latest profile info
        refreshUserData();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Refresh user data to ensure we have the latest profile information
      await refreshUserData();
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, role = 'candidate') => {
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const formData = new FormData();
      
      // Add all profile fields to FormData
      Object.keys(profileData).forEach(key => {
        if (key === 'avatar' && profileData[key]) {
          formData.append('avatar', profileData[key]);
        } else if (key === 'skills' || key === 'portfolio_links') {
          // Handle arrays
          formData.append(key, JSON.stringify(profileData[key]));
        } else if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
          formData.append(key, profileData[key]);
        }
      });

      const response = await api.put('/api/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { user: updatedUser } = response.data;
      
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUserData,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};