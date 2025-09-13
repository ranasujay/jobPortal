import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { applicationsAPI } from '../api/applications';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  FileText, 
  MapPin, 
  Building, 
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users
} from 'lucide-react';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawing, setWithdrawing] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user is authenticated and is a candidate
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (user && user.role !== 'candidate') {
      navigate('/jobs');
      return;
    }
  }, [user, isAuthenticated, navigate]);

  // Fetch user's applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const response = await applicationsAPI.getMyApplications();
        setApplications(response || []);
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
        setError('Failed to load your applied jobs');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'candidate') {
      fetchAppliedJobs();
    }
  }, [isAuthenticated, user]);

  // Withdraw application
  const handleWithdraw = async (applicationId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setWithdrawing(applicationId);
      await applicationsAPI.withdrawApplication(applicationId, 'Withdrawn by applicant');
      
      // Remove the application from the list
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      
      // Show success message (optional)
      alert('Application withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setWithdrawing('');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="h-3 w-3" />,
        text: 'Pending'
      },
      reviewing: {
        color: 'bg-blue-100 text-blue-800',
        icon: <Eye className="h-3 w-3" />,
        text: 'Under Review'
      },
      interviewed: {
        color: 'bg-purple-100 text-purple-800',
        icon: <Users className="h-3 w-3" />,
        text: 'Interviewed'
      },
      accepted: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />,
        text: 'Accepted'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="h-3 w-3" />,
        text: 'Rejected'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  // Helper function to get status stats
  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    return stats;
  };

  // Filter applications based on status
  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  // Show access denied if not candidate
  if (!isAuthenticated || (user && user.role !== 'candidate')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only candidates can view applied jobs.</p>
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
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Applied Jobs</h1>
              <p className="text-gray-600">
                Track your job applications and their status
                {statusFilter !== 'all' && (
                  <span className="ml-2 text-sm">
                    (Showing {filteredApplications.length} of {applications.length} applications)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <Link to="/jobs">
                <Button className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Applied</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.reviewing}</div>
                <div className="text-sm text-gray-500">Under Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.interviewed}</div>
                <div className="text-sm text-gray-500">Interviewed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <div className="text-sm text-gray-500">Accepted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-gray-500">Rejected</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No applications yet' : `No ${statusFilter} applications`}
              </h3>
              <p className="text-gray-500 mb-4">
                {statusFilter === 'all' 
                  ? 'You haven\'t applied to any jobs yet. Start browsing and apply to jobs that interest you.'
                  : `You don't have any ${statusFilter} applications at the moment.`
                }
              </p>
              <Link to="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Link
                            to={`/jobs/${application.job._id}`}
                            className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {application.job.title}
                          </Link>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Building className="h-4 w-4 mr-1" />
                            <div className="flex items-center mr-4">
                              {application.job.company?.logo_url && (
                                <img
                                  src={application.job.company.logo_url}
                                  alt={application.job.company.name}
                                  className="h-4 w-4 rounded object-cover mr-1"
                                />
                              )}
                              <span>{application.job.company?.name || 'Company Name'}</span>
                            </div>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{application.job.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {application.job.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied {formatDate(application.applied_at)}
                          </div>
                          {application.job.salary_range && (
                            <div className="text-green-600 font-medium">
                              {application.job.salary_range}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link to={`/jobs/${application.job._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Job
                            </Button>
                          </Link>
                          
                          {(application.status === 'pending' || application.status === 'reviewing') && !application.withdrawn && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleWithdraw(application._id, application.job.title)}
                              disabled={withdrawing === application._id}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              {withdrawing === application._id ? (
                                <>
                                  <Clock className="h-4 w-4 mr-1 animate-spin" />
                                  Withdrawing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Withdraw
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;