import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationsAPI } from '../../api/applications';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const JobApplicationForm = ({ job, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetterText: '',
    additionalInfo: '',
    resume: null,
    coverLetter: null
  });
  const [errors, setErrors] = useState({});

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

    // Resume is required
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    // Cover letter text is optional but if provided, should have minimum length
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
      setLoading(true);

      const applicationData = {
        jobId: job._id,
        coverLetterText: formData.coverLetterText,
        additionalInfo: formData.additionalInfo,
        resume: formData.resume,
        coverLetter: formData.coverLetter
      };

      await applicationsAPI.applyToJob(applicationData);
      
      onSuccess && onSuccess();
      onClose && onClose();
      
    } catch (error) {
      console.error('Application error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Apply for {job.title}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Job Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
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
              {errors.additionalInfo && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.additionalInfo}
                </p>
              )}
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
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationForm;