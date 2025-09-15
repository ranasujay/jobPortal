import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../api/jobs';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatSalary } from '../utils/formatSalary';
import { 
  Briefcase, 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  Calendar,
  Trash2,
  Eye,
  Users,
  Clock
} from 'lucide-react';

const MyJobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is recruiter
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (user && user.role !== 'recruiter') {
      navigate('/jobs');
      return;
    }
  }, [user, isAuthenticated, navigate]);

  // Fetch recruiter's jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        const response = await jobsAPI.getMyJobs();
        setJobs(response || []);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load your jobs');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'recruiter') {
      fetchMyJobs();
    }
  }, [user]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await jobsAPI.deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully');
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
      'remote': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Show access denied if not recruiter
  if (!isAuthenticated || (user && user.role !== 'recruiter')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only recruiters can access job management.</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
              <p className="text-gray-600">
                Manage your job postings and track applications
              </p>
            </div>
            <Link to="/post-job">
              <Button className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-2" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">
              Start by posting your first job to attract top talent
            </p>
            <Link to="/post-job">
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {jobs.filter(job => job.is_active).length}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {jobs.filter(job => 
                        new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Jobs Cards */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job._id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="mr-4">{job.location}</span>
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.job_type)}`}>
                            {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {job.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Posted {formatDate(job.createdAt)}
                          </div>
                          {job.expires_at && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Expires {formatDate(job.expires_at)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;