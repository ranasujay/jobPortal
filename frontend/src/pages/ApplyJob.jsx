import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../api/jobs';
import { applicationsAPI } from '../api/applications';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Building,
  MapPin,
  DollarSign
} from 'lucide-react';

const ApplyJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetterText: '',
    additionalInfo: '',
    resume: null,
    coverLetter: null
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (user?.role !== 'candidate') {
      navigate('/jobs');
      return;
    }

    fetchJob();
  }, [jobId, isAuthenticated, user, navigate]);

  useEffect(() => {
    // Pre-fill user data when user is loaded
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const jobData = await jobsAPI.getJob(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job:', error);
      navigate('/jobs');
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

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'File size must be less than 10MB'
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'Only PDF, DOC, DOCX, and TXT files are allowed'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));

      // Clear error
      setErrors(prev => ({
        ...prev,
        [fileType]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Resume is required
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    // Cover letter text validation (optional but if provided, should have minimum length)
    if (formData.coverLetterText && formData.coverLetterText.length < 50) {
      newErrors.coverLetterText = 'Cover letter should be at least 50 characters';
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
      setSubmitting(true);

      const applicationData = {
        jobId: job._id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        coverLetterText: formData.coverLetterText,
        additionalInfo: formData.additionalInfo,
        resume: formData.resume,
        coverLetter: formData.coverLetter
      };

      await applicationsAPI.applyToJob(applicationData);
      
      // Success - redirect to applied jobs or job details
      alert('Application submitted successfully!');
      navigate(`/jobs/${job._id}`);
      
    } catch (error) {
      console.error('Application error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job Not Found</h3>
            <p className="text-gray-500 mb-4">
              The job you're trying to apply for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Details
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Job</h1>
            <p className="text-gray-600">
              Fill out the form below to submit your application
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    {job.company?.logo_url && (
                      <img
                        src={job.company.logo_url}
                        alt={job.company.name}
                        className="h-5 w-5 rounded object-cover mr-2"
                      />
                    )}
                    <span>{job.company?.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location}</span>
                </div>

                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                        : job.salary_min
                        ? `From $${job.salary_min.toLocaleString()}`
                        : `Up to $${job.salary_max.toLocaleString()}`}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.job_type || 'Full-time'}
                  </span>
                  {job.experience_level && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.experience_level}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Application Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                    
                    {/* Resume Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resume <span className="text-red-500">*</span>
                      </label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        errors.resume ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="file"
                          id="resume"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileChange(e, 'resume')}
                          className="hidden"
                        />
                        <label htmlFor="resume" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {formData.resume ? (
                              <span className="flex items-center justify-center gap-2">
                                <FileText className="h-4 w-4" />
                                {formData.resume.name} ({formatFileSize(formData.resume.size)})
                              </span>
                            ) : (
                              <>Click to upload resume or drag and drop<br />
                              <span className="text-xs text-gray-400">PDF, DOC, DOCX, TXT (Max 10MB)</span></>
                            )}
                          </p>
                        </label>
                      </div>
                      {errors.resume && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.resume}
                        </p>
                      )}
                    </div>

                    {/* Cover Letter File (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter Document (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="coverLetter"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileChange(e, 'coverLetter')}
                          className="hidden"
                        />
                        <label htmlFor="coverLetter" className="cursor-pointer">
                          <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm text-gray-600">
                            {formData.coverLetter ? (
                              <span className="flex items-center justify-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {formData.coverLetter.name} ({formatFileSize(formData.coverLetter.size)})
                              </span>
                            ) : (
                              'Upload cover letter document'
                            )}
                          </p>
                        </label>
                      </div>
                      {errors.coverLetter && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.coverLetter}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      name="coverLetterText"
                      value={formData.coverLetterText}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                        errors.coverLetterText ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.coverLetterText.length}/2000 characters
                    </p>
                    {errors.coverLetterText && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.coverLetterText}
                      </p>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Any additional information you'd like to share (portfolio links, availability, etc.)..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.additionalInfo.length}/1000 characters
                    </p>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;