const Application = require('../models/Application');
const Job = require('../models/Job');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
    }
  }
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (buffer, filename, folder, userId) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'raw', // Use raw for all document types for consistency
      folder: `job-portal/${folder}/user-${userId}`,
      public_id: `${folder}-${Date.now()}`,
      use_filename: false, // Let Cloudinary generate unique names
      unique_filename: true,
      overwrite: false,
      // Make files publicly accessible (no authentication required)
      type: 'upload', // Ensure it's a regular upload, not authenticated
      // Store original filename in context for retrieval
      context: {
        original_name: filename,
        upload_time: new Date().toISOString()
      }
    };

    cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    }).end(buffer);
  });
};

// @desc    Apply to a job
// @route   POST /api/applications/apply
// @access  Private (job seekers only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetterText, additionalInfo } = req.body;
    const userId = req.user.id;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.is_active || job.expires_at < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Check if user is trying to apply to their own job
    if (job.posted_by.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to your own job posting'
      });
    }

    // Prepare application data
    const applicationData = {
      applicant: userId,
      job: jobId,
      applicant_info: {
        full_name: fullName,
        email: email,
        phone: phone
      },
      cover_letter_text: coverLetterText,
      additional_info: additionalInfo,
      documents: {}
    };

    // Handle file uploads if present
    if (req.files) {
      // Upload resume
      if (req.files.resume) {
        const resumeFile = req.files.resume[0];
        const resumeUpload = await uploadToCloudinary(
          resumeFile.buffer,
          resumeFile.originalname,
          'resumes',
          userId
        );

        applicationData.documents.resume = {
          cloudinary_id: resumeUpload.public_id,
          secure_url: resumeUpload.secure_url,
          original_filename: resumeFile.originalname,
          file_size: resumeFile.size,
          content_type: resumeFile.mimetype
        };
      }

      // Upload cover letter file (optional)
      if (req.files.coverLetter) {
        const coverLetterFile = req.files.coverLetter[0];
        const coverLetterUpload = await uploadToCloudinary(
          coverLetterFile.buffer,
          coverLetterFile.originalname,
          'cover-letters',
          userId
        );

        applicationData.documents.cover_letter = {
          cloudinary_id: coverLetterUpload.public_id,
          secure_url: coverLetterUpload.secure_url,
          original_filename: coverLetterFile.originalname,
          file_size: coverLetterFile.size,
          content_type: coverLetterFile.mimetype
        };
      }
    }

    // Create application
    const application = await Application.create(applicationData);

    // Populate the application with job and applicant details
    await application.populate([
      { path: 'job', select: 'title company' },
      { path: 'applicant', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application'
    });
  }
};

// @desc    Get applications for a specific job (recruiter only)
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiters only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Verify job exists and user is the recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.posted_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    // Get applications with applicant details
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phone')
      .sort({ applied_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id/status
// @access  Private (recruiters only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    // Find application and verify permissions
    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the recruiter who posted the job
    if (application.job.posted_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application.status = status;
    application.recruiter_notes = notes || application.recruiter_notes;
    application.status_updated_by = userId;
    await application.save();

    // Populate updated application
    await application.populate([
      { path: 'applicant', select: 'name email' },
      { path: 'job', select: 'title' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/my-applications
// @access  Private (job seekers)
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location description salary_range job_type experience_level is_active posted_by')
      .populate('job.company', 'name logo_url')
      .sort({ applied_at: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Withdraw application
// @route   PATCH /api/applications/:id/withdraw
// @access  Private (applicant only)
exports.withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (!application.canBeWithdrawn()) {
      return res.status(400).json({
        success: false,
        message: 'Application cannot be withdrawn at this stage'
      });
    }

    // Withdraw application
    application.withdrawn = true;
    application.withdrawn_at = new Date();
    application.withdrawal_reason = reason;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: application
    });

  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get application document (secure download)
// @route   GET /api/applications/:id/document/:type
// @access  Private (recruiter or applicant)
exports.getApplicationDocument = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check permissions (applicant or job recruiter)
    const isApplicant = application.applicant.toString() === userId;
    const isRecruiter = application.job.posted_by.toString() === userId;

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    // Get document URL
    const document = application.documents[type];
    if (!document || !document.secure_url) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // For document access, use the secure_url directly
    // Cloudinary authenticated files are already access-controlled
    const signedUrl = document.secure_url;

    res.status(200).json({
      success: true,
      data: {
        download_url: signedUrl,
        secure_url: document.secure_url, // Backup URL
        filename: document.original_filename,
        file_size: document.file_size,
        content_type: document.content_type || 'application/pdf'
      }
    });

  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Serve application document directly
// @route   GET /api/applications/:id/document/:type/view
// @access  Private (recruiter or applicant)
exports.serveApplicationDocument = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { download } = req.query; // ?download=true for download mode
    const userId = req.user.id;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check permissions (applicant or job recruiter)
    const isApplicant = application.applicant.toString() === userId;
    const isRecruiter = application.job.posted_by.toString() === userId;

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    // Get document URL
    const document = application.documents[type];
    if (!document || !document.secure_url) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Use the original secure_url from Cloudinary upload
    let cloudinaryUrl = document.secure_url;
    
    // For files that might be returning 401 (authenticated), try to generate a signed URL
    if (document.cloudinary_id) {
      try {
        // Check if this is an old authenticated file by looking at the URL pattern
        if (cloudinaryUrl.includes('/image/upload/') || cloudinaryUrl.includes('authenticated')) {
          // Generate a signed URL for temporary access
          const signedUrl = cloudinary.utils.private_download_url(
            document.cloudinary_id,
            {
              expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
            }
          );
          
          if (signedUrl) {
            cloudinaryUrl = signedUrl;
          }
        }
      } catch (signError) {
        console.error('Error generating signed URL:', signError);
        // Continue with original URL
      }
    }
    
    // Set appropriate headers for file serving
    const contentType = document.content_type || 'application/pdf';
    const filename = document.original_filename || `${type}.pdf`;
    
    if (download === 'true') {
      // Force download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
      // Inline viewing
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    }
    
    res.setHeader('Content-Type', contentType);
    res.redirect(cloudinaryUrl);

  } catch (error) {
    console.error('Error serving document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Proxy serve application document (downloads from Cloudinary and serves)
// @route   GET /api/applications/:id/document/:type/proxy
// @access  Private (recruiter or applicant)
exports.proxyApplicationDocument = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { download } = req.query;
    const userId = req.user.id;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check permissions
    const isApplicant = application.applicant.toString() === userId;
    const isRecruiter = application.job.posted_by.toString() === userId;

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    // Get document
    const document = application.documents[type];
    if (!document || !document.secure_url) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Fetch the file from Cloudinary
    const https = require('https');
    const http = require('http');
    const url = require('url');
    
    const cloudinaryUrl = document.secure_url;
    const parsedUrl = url.parse(cloudinaryUrl);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = client.get(cloudinaryUrl, (cloudinaryRes) => {
      if (cloudinaryRes.statusCode !== 200) {
        console.error('Cloudinary returned status:', cloudinaryRes.statusCode);
        return res.status(404).json({
          success: false,
          message: 'Document not accessible from storage'
        });
      }
      
      // Set appropriate headers
      const contentType = document.content_type || 'application/pdf';
      const filename = document.original_filename || `${type}.pdf`;
      
      res.setHeader('Content-Type', contentType);
      
      if (download === 'true') {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      } else {
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      }
      
      // Pipe the file content directly to the response
      cloudinaryRes.pipe(res);
    });
    
    request.on('error', (error) => {
      console.error('Error fetching from Cloudinary:', error);
      res.status(500).json({
        success: false,
        message: 'Error accessing document'
      });
    });

  } catch (error) {
    console.error('Error proxying document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Debug endpoint to check document data
// @route   GET /api/applications/:id/debug
// @access  Private (recruiter or applicant)
exports.debugApplicationDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(id).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check permissions (applicant or job recruiter)
    const isApplicant = application.applicant.toString() === userId;
    const isRecruiter = application.job.posted_by.toString() === userId;

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        applicationId: application._id,
        documents: application.documents,
        applicant_info: application.applicant_info
      }
    });

  } catch (error) {
    console.error('Error debugging document:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Export multer upload middleware
exports.uploadMiddleware = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]);