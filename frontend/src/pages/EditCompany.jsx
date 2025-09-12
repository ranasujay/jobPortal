import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companiesAPI } from '../api/companies';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { 
  Building2, 
  Save, 
  ArrowLeft, 
  Globe, 
  MapPin, 
  Users, 
  Calendar,
  Briefcase
} from 'lucide-react';

const EditCompany = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: companyId } = useParams();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logo_url: '',
    industry: '',
    size: '',
    founded: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Redirect if not a recruiter
    if (user && user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    // Redirect if no company ID provided
    if (!companyId) {
      navigate('/my-companies');
      return;
    }

    fetchCompany();
  }, [user, navigate, companyId]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const data = await companiesAPI.getCompany(companyId);
      
      // Check if current user owns this company
      if (data.owner._id !== user.id) {
        alert('You are not authorized to edit this company');
        navigate('/my-companies');
        return;
      }
      
      setCompany(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        website: data.website || '',
        location: data.location || '',
        logo_url: data.logo_url || '',
        industry: data.industry || '',
        size: data.size || '',
        founded: data.founded || ''
      });
    } catch (error) {
      console.error('Error fetching company:', error);
      alert('Company not found or you do not have permission to edit it');
      navigate('/my-companies');
    } finally {
      setLoading(false);
    }
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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Company description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.size) {
      newErrors.size = 'Company size is required';
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    if (formData.founded && (formData.founded < 1800 || formData.founded > new Date().getFullYear())) {
      newErrors.founded = 'Please enter a valid founding year';
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
      
      // Clean up form data
      const updateData = { ...formData };
      if (updateData.founded) {
        updateData.founded = parseInt(updateData.founded);
      }
      if (!updateData.website) {
        delete updateData.website;
      }
      if (!updateData.logo_url) {
        delete updateData.logo_url;
      }

      await companiesAPI.updateCompany(company._id, updateData);
      
      // Show success message and redirect
      alert('Company profile updated successfully!');
      navigate('/my-companies');
      
    } catch (error) {
      console.error('Error updating company:', error);
      alert(error.response?.data?.message || 'Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Company Profile</h1>
              <p className="text-gray-600">Update your company information</p>
            </div>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your company..."
                className={`w-full rounded-md border ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Location *
              </label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <Input
                id="logo_url"
                name="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Industry and Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Industry */}
              <div>
                <label htmlFor="industry" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Industry *
                </label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., Technology, Healthcare"
                  className={errors.industry ? 'border-red-500' : ''}
                />
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>

              {/* Company Size */}
              <div>
                <label htmlFor="size" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Company Size *
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className={`w-full rounded-md border ${errors.size ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
              </div>
            </div>

            {/* Founded Year */}
            <div>
              <label htmlFor="founded" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Founded Year
              </label>
              <Input
                id="founded"
                name="founded"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.founded}
                onChange={handleInputChange}
                placeholder="e.g., 2020"
                className={errors.founded ? 'border-red-500' : ''}
              />
              {errors.founded && <p className="text-red-500 text-sm mt-1">{errors.founded}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditCompany;