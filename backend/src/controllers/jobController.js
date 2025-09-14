const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const cloudinary = require('../config/cloudinary');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    let query = {};
    const { search, location, job_type, experience_level, company } = req.query;

    // Build search query
    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (job_type) {
      query.job_type = job_type;
    }

    if (experience_level) {
      query.experience_level = experience_level;
    }

    if (company) {
      query.company = company;
    }

    // Only active jobs
    query.is_active = true;
    query.expires_at = { $gt: new Date() };

    const jobs = await Job.find(query)
      .populate('company', 'name logo_url location')
      .populate('posted_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo_url location description website')
      .populate('posted_by', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Get applications count for this job
    const applicationsCount = await Application.countDocuments({ job: req.params.id });

    // Add applications count to job data
    const jobWithApplications = {
      ...job.toObject(),
      applications: { length: applicationsCount }
    };

    res.status(200).json({
      success: true,
      data: jobWithApplications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (recruiters only)
exports.createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.posted_by = req.user.id;

    // Validate that company exists and belongs to the user
    if (!req.body.company) {
      return res.status(400).json({
        success: false,
        message: 'Please select a company'
      });
    }

    const company = await Company.findOne({
      _id: req.body.company,
      owner: req.user.id
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Company not found or you do not have permission to post jobs for this company'
      });
    }

    const job = await Job.create(req.body);

    // Populate the job with company info before sending response
    const populatedJob = await Job.findById(job._id)
      .populate('company', 'name logo_url location')
      .populate('posted_by', 'name email');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: populatedJob
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (job owner only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner
    if (job.posted_by.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Handle company name update if provided
    if (req.body.company_name) {
      let company = await Company.findOne({ owner: req.user.id });
      if (company && req.body.company_name !== company.name) {
        company.name = req.body.company_name;
        await company.save();
      }
    }

    // Remove company_name from job data as it's not part of job schema
    const { company_name, ...jobData } = req.body;

    job = await Job.findByIdAndUpdate(req.params.id, jobData, {
      new: true,
      runValidators: true
    }).populate('company', 'name logo_url location')
      .populate('posted_by', 'name email');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (job owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner
    if (job.posted_by.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Get all applications for this job to clean up their files
    const applications = await Application.find({ job: req.params.id });

    // Delete files from Cloudinary for each application
    for (const application of applications) {
      try {
        // Delete resume file if exists
        if (application.documents?.resume?.cloudinary_id) {
          await cloudinary.uploader.destroy(application.documents.resume.cloudinary_id);
        }
        
        // Delete cover letter file if exists
        if (application.documents?.cover_letter?.cloudinary_id) {
          await cloudinary.uploader.destroy(application.documents.cover_letter.cloudinary_id);
        }
      } catch (fileError) {
        console.error('Error deleting files from Cloudinary:', fileError);
        // Continue with deletion even if file cleanup fails
      }
    }

    // Delete all applications related to this job
    await Application.deleteMany({ job: req.params.id });

    // Then delete the job
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job and all related applications deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get jobs posted by current user
// @route   GET /api/jobs/my-jobs
// @access  Private
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ posted_by: req.user.id })
      .populate('company', 'name logo_url')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user's applied jobs
// @route   GET /api/jobs/applied
// @access  Private (candidates only)
exports.getAppliedJobs = async (req, res) => {
  try {
    // Find all jobs where the current user has applied
    const jobs = await Job.find({
      'applications.user': req.user.id
    })
    .populate('company', 'name logo_url location')
    .populate('posted_by', 'name email')
    .sort({ 'applications.applied_at': -1 });

    // Transform the data to include application details
    const appliedJobs = jobs.map(job => {
      // Find the user's application in this job
      const userApplication = job.applications.find(
        app => app.user.toString() === req.user.id
      );

      return {
        _id: userApplication._id,
        job: {
          _id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          job_type: job.job_type,
          company: job.company,
          is_active: job.is_active,
          expires_at: job.expires_at
        },
        applied_at: userApplication.applied_at,
        status: userApplication.status
      };
    });

    res.status(200).json({
      success: true,
      count: appliedJobs.length,
      data: appliedJobs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};