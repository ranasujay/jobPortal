import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { applicationsAPI } from '../api/applications';
import { jobsAPI } from '../api/jobs';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  ArrowLeft,
  FileText,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedNotes, setExpandedNotes] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [showRejectModal, setShowRejectModal] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [downloadingDoc, setDownloadingDoc] = useState('');

  useEffect(() => {
    fetchJobAndApplications();
  }, [jobId]);

  const fetchJobAndApplications = async () => {
    try {
      setLoading(true);
      const [jobData, applicationsData] = await Promise.all([
        jobsAPI.getJob(jobId),
        applicationsAPI.getJobApplications(jobId)
      ]);
      
      setJob(jobData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      navigate('/my-jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort applications
  const filteredAndSortedApplications = applications
    .filter(app => statusFilter === 'all' || app.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.applied_at) - new Date(a.applied_at);
        case 'oldest':
          return new Date(a.applied_at) - new Date(b.applied_at);
        case 'name':
          return a.applicant_info?.full_name?.localeCompare(b.applicant_info?.full_name || '');
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Get application statistics
  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewing: applications.filter(app => app.status === 'reviewing').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };
    return stats;
  };

  const stats = getApplicationStats();

  const handleStatusUpdate = async (applicationId, newStatus) => {
    // If rejecting, show modal for feedback
    if (newStatus === 'rejected') {
      setShowRejectModal(applicationId);
      return;
    }

    try {
      setUpdating(applicationId);
      await applicationsAPI.updateApplicationStatus(applicationId, newStatus, '');
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus, status_updated_at: new Date() }
            : app
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdating('');
    }
  };

  const handleRejectWithReason = async (applicationId) => {
    try {
      setUpdating(applicationId);
      await applicationsAPI.updateApplicationStatus(applicationId, 'rejected', rejectReason);
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, status: 'rejected', status_updated_at: new Date() }
            : app
        )
      );
      
      setShowRejectModal('');
      setRejectReason('');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status');
    } finally {
      setUpdating('');
    }
  };

  const handleDownloadDocument = async (applicationId, documentType) => {
    try {
      // Find the application and check if document exists
      const application = applications.find(app => app._id === applicationId);
      
      if (!application?.documents?.[documentType] || !application.documents[documentType].secure_url) {
        alert(`No ${documentType === 'cover_letter' ? 'cover letter' : 'resume'} uploaded for this application`);
        return;
      }

      const docKey = `${applicationId}-${documentType}`;
      setDownloadingDoc(docKey);
      
      await applicationsAPI.downloadDocument(applicationId, documentType);
    } catch (error) {
      console.error('Error downloading document:', error);
      
      // More specific error messages
      if (error.response?.status === 404) {
        alert('Document not found. It may have been removed or is not available.');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to access this document.');
      } else {
        alert('Failed to download document. Please try again.');
      }
    } finally {
      setDownloadingDoc('');
    }
  };

  const handleViewDocument = async (applicationId, documentType) => {
    try {
      // Find the application and check if document exists
      const application = applications.find(app => app._id === applicationId);
      
      if (!application?.documents?.[documentType] || !application.documents[documentType].secure_url) {
        alert(`No ${documentType === 'cover_letter' ? 'cover letter' : 'resume'} uploaded for this application`);
        return;
      }

      await applicationsAPI.viewDocument(applicationId, documentType);
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Failed to view document');
    }
  };

  const handleNotesUpdate = async (applicationId, notes) => {
    try {
      // Save notes to backend
      const application = applications.find(app => app._id === applicationId);
      await applicationsAPI.updateApplicationStatus(applicationId, application.status, notes);
      
      // Update local state after successful API call
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId 
            ? { ...app, recruiter_notes: notes }
            : app
        )
      );
      setExpandedNotes('');
      setNotesInput('');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    }
  };

  // Helper function to get relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'interviewed':
        return <Calendar className="h-4 w-4" />;
      case 'reviewing':
        return <Eye className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
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
            variant="outline"
            onClick={() => navigate('/my-jobs')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Jobs
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Applications for "{job?.title}"
              </h1>
              <p className="text-gray-600">
                {applications.length} application{applications.length !== 1 ? 's' : ''} received
                {statusFilter !== 'all' && (
                  <span className="ml-2">
                    (Showing {filteredAndSortedApplications.length})
                  </span>
                )}
              </p>
            </div>
            
            {/* Filters and Sort */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Under Review</option>
                <option value="interviewed">Interviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="status">By Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {applications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
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
                <div className="text-sm text-gray-500">Reviewing</div>
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
        {filteredAndSortedApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'all' ? 'No Applications Yet' : `No ${statusFilter} Applications`}
              </h3>
              <p className="text-gray-500">
                {statusFilter === 'all' 
                  ? 'Applications will appear here once candidates start applying to your job.'
                  : `There are no ${statusFilter} applications at the moment.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedApplications.map((application) => (
              <Card key={application._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Applicant Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {application.applicant_info?.full_name || application.applicant?.name || 'Unknown Applicant'}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Mail className="h-4 w-4 mr-1" />
                            <a 
                              href={`mailto:${application.applicant_info?.email || application.applicant?.email}?subject=Regarding your application for ${job?.title}`} 
                              className="hover:text-blue-600 mr-2"
                            >
                              {application.applicant_info?.email || application.applicant?.email}
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2 py-1 text-xs"
                              onClick={() => window.open(`mailto:${application.applicant_info?.email || application.applicant?.email}?subject=Regarding your application for ${job?.title}&body=Dear ${application.applicant_info?.full_name || application.applicant?.name},%0A%0AThank you for your interest in the ${job?.title} position.%0A%0ABest regards`)}
                            >
                              Quick Email
                            </Button>
                          </div>
                          {(application.applicant_info?.phone || application.applicant?.phone) && (
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-1" />
                              <a 
                                href={`tel:${application.applicant_info?.phone || application.applicant?.phone}`}
                                className="hover:text-blue-600"
                              >
                                {application.applicant_info?.phone || application.applicant?.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </div>
                      </div>

                      {/* Cover Letter Preview */}
                      {application.cover_letter_text && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                          <p className="text-gray-700 text-sm line-clamp-3">
                            {application.cover_letter_text}
                          </p>
                        </div>
                      )}

                      {/* Additional Info */}
                      {application.additional_info && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                          <p className="text-gray-700 text-sm">
                            {application.additional_info}
                          </p>
                        </div>
                      )}

                      {/* Recruiter Notes Section */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Recruiter Notes</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (expandedNotes === application._id) {
                                setExpandedNotes('');
                                setNotesInput('');
                              } else {
                                setExpandedNotes(application._id);
                                setNotesInput(application.recruiter_notes || '');
                              }
                            }}
                          >
                            {expandedNotes === application._id ? 'Cancel' : 'Add/Edit Notes'}
                          </Button>
                        </div>
                        
                        {application.recruiter_notes && expandedNotes !== application._id && (
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                            {application.recruiter_notes}
                          </p>
                        )}
                        
                        {expandedNotes === application._id && (
                          <div className="space-y-2">
                            <textarea
                              value={notesInput}
                              onChange={(e) => setNotesInput(e.target.value)}
                              placeholder="Add your notes about this candidate..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleNotesUpdate(application._id, notesInput)}
                              >
                                Save Notes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setExpandedNotes('');
                                  setNotesInput('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="space-y-3 mb-4">
                        {/* Resume Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Resume</h5>
                          {application.documents?.resume ? (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDocument(application._id, 'resume')}
                                className="flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Resume
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(application._id, 'resume')}
                                disabled={downloadingDoc === `${application._id}-resume`}
                                className="flex items-center"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                {downloadingDoc === `${application._id}-resume` ? (
                                  <Clock className="h-3 w-3 ml-1 animate-spin" />
                                ) : (
                                  <Download className="h-3 w-3 ml-1" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No resume uploaded</p>
                          )}
                        </div>
                        
                        {/* Cover Letter Section */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Cover Letter</h5>
                          {application.documents?.cover_letter ? (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDocument(application._id, 'cover_letter')}
                                className="flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Cover Letter
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(application._id, 'cover_letter')}
                                disabled={downloadingDoc === `${application._id}-cover_letter`}
                                className="flex items-center"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                {downloadingDoc === `${application._id}-cover_letter` ? (
                                  <Clock className="h-3 w-3 ml-1 animate-spin" />
                                ) : (
                                  <Download className="h-3 w-3 ml-1" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No cover letter uploaded</p>
                          )}
                        </div>
                      </div>

                      {/* Application Date */}
                      <div className="text-sm text-gray-500">
                        <p>
                          Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getRelativeTime(application.applied_at)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2 min-w-[200px]">
                      <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                      
                      {application.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application._id, 'reviewing')}
                            disabled={updating === application._id}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark as Reviewing
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            disabled={updating === application._id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {application.status === 'reviewing' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application._id, 'interviewed')}
                            disabled={updating === application._id}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Schedule Interview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            disabled={updating === application._id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {application.status === 'interviewed' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application._id, 'accepted')}
                            disabled={updating === application._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            disabled={updating === application._id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {(application.status === 'accepted' || application.status === 'rejected') && (
                        <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                          Status updated on {new Date(application.status_updated_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reject Application
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this application (optional):
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Qualifications don't match our requirements, Position filled, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                rows={3}
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal('');
                    setRejectReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleRejectWithReason(showRejectModal)}
                  disabled={updating === showRejectModal}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updating === showRejectModal ? 'Rejecting...' : 'Reject Application'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;