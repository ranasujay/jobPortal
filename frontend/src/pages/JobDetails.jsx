import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../api/jobs';
import { applicationsAPI } from '../api/applications';
import { savedJobsAPI } from '../api/savedJobs';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import AuthModal from '../components/auth/AuthModal';
import { formatSalaryFull } from '../utils/formatSalary';
import { 
  MapPin, 
  Building, 
  Clock, 
  Users, 
  DollarSign,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Heart,
  ArrowLeft
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchJob();
    if (isAuthenticated && user && user.role === 'candidate') {
      checkApplicationStatus();
      checkSavedStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const jobData = await jobsAPI.getJob(id);
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      setCheckingApplication(true);
      const applications = await applicationsAPI.getMyApplications();
      const hasAppliedToJob = applications.some(app => app.job._id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Error checking application status:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const isJobSaved = await savedJobsAPI.checkJobSaved(id);
      setIsSaved(isJobSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    try {
      setSavingJob(true);
      if (isSaved) {
        await savedJobsAPI.unsaveJob(id);
        setIsSaved(false);
      } else {
        await savedJobsAPI.saveJob(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save job. Please try again.';
      alert(errorMessage);
    } finally {
      setSavingJob(false);
    }
  };

  const handleApplyJob = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/apply-job/${job._id}`);
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobsAPI.deleteJob(id);
        navigate('/my-jobs');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  // Check if current user is the recruiter who posted this job
  const isJobOwner = user && job && job.posted_by?._id === user.id;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
            <p className="text-gray-500">
              The job you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Job Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                {job.company?.logo_url && (
                  <img
                    src={job.company.logo_url}
                    alt={job.company.name}
                    className="h-6 w-6 rounded object-cover mr-2"
                  />
                )}
                <Link 
                  to={`/companies/${job.company?._id}`}
                  className="text-lg hover:text-blue-600 transition-colors"
                >
                  {job.company?.name || 'Company Name'}
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>
                {job.applications?.length > 0 && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {job.applications.length} applicants
                  </div>
                )}
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center text-green-600 font-medium">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatSalaryFull(job.salary_min, job.salary_max)}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.job_type || 'Full-time'}
                </span>
                {job.experience_level && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {job.experience_level}
                  </span>
                )}
                {job.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Actively Hiring
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Applications Closed
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4 mt-6">
            {isJobOwner ? (
              // Show recruiter/job owner options
              <>
                <Link to={`/jobs/${job._id}/edit`}>
                  <Button size="lg" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Job
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/job-applications/${job._id}`)}
                >
                  <Eye className="h-4 w-4" />
                  View Applicants ({job.applications?.length || 0})
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
                  onClick={handleDeleteJob}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Job
                </Button>
              </>
            ) : job.is_active && isAuthenticated && user.role === 'candidate' ? (
              // Show job seeker options only for active jobs and candidates
              <>
                {checkingApplication ? (
                  <Button 
                    size="lg"
                    disabled
                  >
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </Button>
                ) : hasApplied ? (
                  <Button 
                    size="lg"
                    variant="outline"
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => navigate('/applied-jobs')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Applied - View Status
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    onClick={handleApplyJob}
                  >
                    Apply Now
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleSaveJob}
                  disabled={savingJob}
                  className={`flex items-center gap-2 ${
                    isSaved 
                      ? 'text-red-500 border-red-500 hover:bg-red-50' 
                      : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {savingJob ? 'Saving...' : (isSaved ? 'Saved' : 'Save Job')}
                </Button>
                
                {hasApplied && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ You have already applied to this position. Click "Applied - View Status" to track your application.
                  </p>
                )}
              </>
            ) : job.is_active && !isAuthenticated ? (
              // Show login prompt for non-logged in users
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                >
                  Login to Apply
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Login to Save
                </Button>
              </div>
            ) : job.is_active && isAuthenticated && user.role !== 'candidate' ? (
              // Show message for non-candidates (recruiters)
              <div className="text-gray-500 italic">
                Only candidates can apply to jobs
              </div>
            ) : (
              // Show message for closed jobs
              <div className="text-gray-500 italic">
                This job is no longer accepting applications
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits & Perks */}
          {job.benefits && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {job.benefits}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Industry</h4>
                <p className="text-gray-600">{job.industry || 'Technology'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Employment Type</h4>
                <p className="text-gray-600">{job.job_type || 'Full-time'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Experience Level</h4>
                <p className="text-gray-600">{job.experience_level || 'Mid Level'}</p>
              </div>
              
              {(job.salary_min || job.salary_max) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Salary Range</h4>
                  <p className="text-gray-600">{formatSalaryFull(job.salary_min, job.salary_max)}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Application Deadline</h4>
                <p className="text-gray-600">
                  {job.expires_at ? new Date(job.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Not specified'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      )}
    </div>
  );
};

export default JobDetails;