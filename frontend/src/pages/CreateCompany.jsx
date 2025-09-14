import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companiesAPI } from '../api/companies';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Building2, Globe, MapPin, Users, Calendar } from 'lucide-react';

const CreateCompany = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allCompanies, setAllCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    size: '',
    founded: ''
  });

  // Industry options
  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Real Estate',
    'Marketing & Advertising',
    'Consulting',
    'Non-profit',
    'Government',
    'Transportation',
    'Energy',
    'Media & Entertainment',
    'Food & Beverage',
    'Other'
  ];

  // Company size options
  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  // Fetch all companies for duplicate name checking
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const fetchAllCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const data = await companiesAPI.getCompanies();
      setAllCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Check if company name already exists (case-insensitive)
  const isCompanyNameDuplicate = (name) => {
    return allCompanies.some(company => 
      company.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time duplicate name checking for company name
    if (name === 'name' && value.trim() && !loadingCompanies) {
      if (isCompanyNameDuplicate(value.trim())) {
        setErrors(prev => ({
          ...prev,
          name: 'A company with this name already exists'
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    } else if (isCompanyNameDuplicate(formData.name.trim())) {
      newErrors.name = 'A company with this name already exists';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot be more than 1000 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }

    if (formData.website && !formData.website.match(/^https?:\/\//)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.founded) {
      const year = parseInt(formData.founded);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        newErrors.founded = `Founded year must be between 1800 and ${currentYear}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        founded: formData.founded ? parseInt(formData.founded) : undefined
      };

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === undefined) {
          delete submitData[key];
        }
      });

      await companiesAPI.createCompany(submitData);
      
      // Navigate back to my companies page
      navigate('/my-companies');
      
    } catch (error) {
      console.error('Error creating company:', error);
      
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        // Handle duplicate company name error specifically
        if (errorMessage.includes('company with this name already exists')) {
          setErrors({ name: 'A company with this name already exists. Please choose a different name.' });
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else {
        alert('Failed to create company. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not a recruiter
  if (user && user.role !== 'recruiter') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/my-companies')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Companies
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Company</h1>
              <p className="text-gray-600">Add your company profile to start posting jobs</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name ? (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                ) : formData.name.trim() && !loadingCompanies && !isCompanyNameDuplicate(formData.name.trim()) ? (
                  <p className="mt-1 text-sm text-green-600">✓ Company name is available</p>
                ) : loadingCompanies && formData.name.trim() ? (
                  <p className="mt-1 text-sm text-gray-500">Checking availability...</p>
                ) : null}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your company, mission, and what makes it special..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : ''}`}
                />
                <div className="mt-1 flex justify-between">
                  <span className="text-sm text-gray-500">
                    {formData.description.length}/1000 characters
                  </span>
                  {errors.description && (
                    <span className="text-sm text-red-600">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY or Remote"
                    className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className={`pl-10 ${errors.website ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              {/* Industry and Size Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.industry ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                  )}
                </div>

                {/* Company Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.size ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select size</option>
                      {companySizes.map(size => (
                        <option key={size} value={size}>
                          {size} employees
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.size && (
                    <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                  )}
                </div>
              </div>

              {/* Founded Year */}
              <div>
                <label htmlFor="founded" className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="founded"
                    name="founded"
                    type="number"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g., 2015"
                    min="1800"
                    max={new Date().getFullYear()}
                    className={`pl-10 ${errors.founded ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.founded && (
                  <p className="mt-1 text-sm text-red-600">{errors.founded}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/my-companies')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCompany;