const Company = require('../models/Company');

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
    // Add user to req.body
    req.body.owner = req.user.id;

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
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

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
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