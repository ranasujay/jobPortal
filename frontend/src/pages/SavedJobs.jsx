import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { savedJobsAPI } from '../api/savedJobs';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heart, MapPin, Building2, Calendar, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';

const SavedJobs = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchSavedJobs();
  }, [isAuthenticated, navigate]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await savedJobsAPI.getSavedJobs();
      setSavedJobs(data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await savedJobsAPI.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(savedJob => savedJob.job._id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
      setError('Failed to unsave job');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
        <p className="text-gray-600">
          Keep track of jobs you're interested in ({savedJobs.length} saved)
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {savedJobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500 mb-6">
            Browse jobs and save the ones that interest you for easy access later
          </p>
          <Button onClick={() => navigate('/jobs')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Browse Jobs
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job;
            return (
              <Card key={savedJob._id} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span className="text-sm">{job.company?.name || 'Company Name'}</span>
                      </div>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnsaveJob(job._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from saved jobs"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize">{job.job_type.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-medium capitalize">{job.experience_level}</span>
                    </div>
                    {job.salary_min && job.salary_max && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Salary:</span>
                        <span className="font-medium">
                          ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Saved Date */}
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Saved on {formatDate(savedJob.createdAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="flex-1"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;