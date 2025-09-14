const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'name email');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (recruiters only)
exports.createCompany = async (req, res) => {
  try {
    // Check if company name already exists (case-insensitive)
    const companyName = req.body.name.trim();
    const existingCompany = await Company.findOne({ 
      name: { $regex: new RegExp(`^${companyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name already exists'
      });
    }

    // Add user to req.body
    req.body.owner = req.user.id;
    req.body.name = companyName; // Use the trimmed name

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });

  } catch (error) {
    // Handle duplicate key error (MongoDB unique constraint) - don't log these as errors
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    // Log unexpected errors only
    console.error('Unexpected error in createCompany:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (company owner only)
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Make sure user is company owner
    if (company.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (company owner only)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Make sure user is company owner
    if (company.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this company'
      });
    }

    // Delete all jobs associated with this company first
    await Job.deleteMany({ company: req.params.id });

    // Then delete the company
    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company and all associated jobs deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user's companies
// @route   GET /api/companies/my-companies
// @access  Private
exports.getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user's company (single - for backward compatibility)
// @route   GET /api/companies/my-company
// @access  Private
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'No company profile found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get jobs by company
// @route   GET /api/companies/:id/jobs
// @access  Public
exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const jobs = await Job.find({ company: req.params.id })
      .populate('company', 'name logo_url location industry')
      .populate('posted_by', 'name')
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