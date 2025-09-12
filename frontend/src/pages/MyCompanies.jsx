import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companiesAPI } from '../api/companies';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getCompanyLogo, generateFallbackLogo, getIndustryColor } from '../utils/logoUtils';
import { 
  Building2, 
  Plus, 
  Edit3, 
  MapPin, 
  Users, 
  Globe, 
  Calendar,
  Briefcase,
  ArrowLeft
} from 'lucide-react';

const MyCompanies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not a recruiter
    if (user && user.role !== 'recruiter') {
      navigate('/');
      return;
    }

    fetchMyCompanies();
  }, [user, navigate]);

  const fetchMyCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesAPI.getMyCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      try {
        await companiesAPI.deleteCompany(companyId);
        setCompanies(prev => prev.filter(company => company._id !== companyId));
        alert('Company deleted successfully!');
      } catch (error) {
        console.error('Error deleting company:', error);
        alert(error.response?.data?.message || 'Failed to delete company');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>
                <p className="text-gray-600">Manage your company profiles</p>
              </div>
            </div>
            
            <Link to="/create-company">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </Link>
          </div>
        </div>

        {/* Companies List */}
        {companies.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any company profiles. Create your first company to start posting jobs.
            </p>
            <Link to="/create-company">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Company
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company._id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Company Logo & Name */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <img
                      src={company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=3b82f6&color=ffffff&bold=true&format=png`}
                      alt={`${company.name} logo`}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-100 border border-gray-200"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=6b7280&color=ffffff&bold=true&format=png`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {company.description}
                    </p>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{company.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{company.industry}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{company.size} employees</span>
                  </div>
                  
                  {company.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  {company.founded && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Founded {company.founded}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link to={`/edit-company/${company._id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteCompany(company._id)}
                    className="px-3"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {companies.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              You have {companies.length} company profile{companies.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCompanies;