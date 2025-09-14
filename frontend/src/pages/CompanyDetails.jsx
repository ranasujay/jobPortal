import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companiesAPI } from '../api/companies';
import { jobsAPI } from '../api/jobs';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar,
  ExternalLink,
  Globe,
  Briefcase,
  Clock,
  DollarSign,
  Edit,
  Plus,
  ArrowLeft
} from 'lucide-react';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
    fetchCompanyJobs();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const companyData = await companiesAPI.getCompany(id);
      setCompany(companyData);
    } catch (error) {
      console.error('Error fetching company details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      setJobsLoading(true);
      const companyJobs = await companiesAPI.getCompanyJobs(id);
      setJobs(companyJobs);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  // Check if current user is the owner of this company
  const isCompanyOwner = user && company && company.owner === user.id;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="h-24 w-24 bg-gray-200 rounded-lg mr-6"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Company not found</h3>
            <p className="text-gray-500">
              The company you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/companies')}
            >
              Back to Companies
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Company Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center mb-6 lg:mb-0">
              <img
                src={company.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=3b82f6&color=ffffff&bold=true&format=png`}
                alt={`${company.name} logo`}
                className="h-24 w-24 rounded-lg object-cover mr-6 border border-gray-200"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=6b7280&color=ffffff&bold=true&format=png`;
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {company.industry}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {company.size} employees
                  </div>
                  {company.founded && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Founded {company.founded}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-4">
              {company.website && (
                <Button
                  variant="outline"
                  onClick={() => window.open(company.website, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              
              {isCompanyOwner && (
                <>
                  <Link to={`/companies/${company._id}/edit`}>
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Company
                    </Button>
                  </Link>
                  <Link to="/post-job">
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Post Job
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* About Company */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About {company.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {company.description}
              </p>
            </CardContent>
          </Card>

          {/* Open Positions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Open Positions ({jobs.length})
                </span>
                {isCompanyOwner && (
                  <Link to="/post-job">
                    <Button size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Post Job
                    </Button>
                  </Link>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {isCompanyOwner 
                      ? "You haven't posted any jobs yet. Start by posting your first job!" 
                      : "This company doesn't have any open positions at the moment."
                    }
                  </p>
                  {isCompanyOwner && (
                    <Link to="/post-job">
                      <Button className="mt-4">Post Your First Job</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link 
                      key={job._id} 
                      to={`/jobs/${job._id}`}
                      className="block"
                    >
                      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {job.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            job.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {job.is_active ? 'Active' : 'Closed'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.job_type || 'Full-time'}
                          </div>
                          {job.salary_range && (
                            <div className="flex items-center text-green-600 font-medium">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary_range}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Posted {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                          {job.applications?.length > 0 && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Users className="h-3 w-3 mr-1" />
                              {job.applications.length} applicants
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                <p className="text-gray-600">{company.industry}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Company Size</h4>
                <p className="text-gray-600">{company.size} employees</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                <p className="text-gray-600">{company.location}</p>
              </div>
              
              {company.founded && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Founded</h4>
                  <p className="text-gray-600">{company.founded}</p>
                </div>
              )}
              
              {company.website && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Website</h4>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visit Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Open Positions</h4>
                <p className="text-gray-600">{jobs.length} active jobs</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;