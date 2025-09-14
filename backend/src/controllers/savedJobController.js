const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Get user's saved jobs
// @route   GET /api/saved-jobs
// @access  Private
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      data: savedJobs
    });

  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({ user: userId, job: jobId });
    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved'
      });
    }

    // Create saved job
    const savedJob = await SavedJob.create({
      user: userId,
      job: jobId
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: savedJob
    });

  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOneAndDelete({ user: userId, job: jobId });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job unsaved successfully'
    });

  } catch (error) {
    console.error('Error unsaving job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Check if job is saved by user
// @route   GET /api/saved-jobs/check/:jobId
// @access  Private
exports.checkJobSaved = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const savedJob = await SavedJob.findOne({ user: userId, job: jobId });

    res.status(200).json({
      success: true,
      data: {
        isSaved: !!savedJob
      }
    });

  } catch (error) {
    console.error('Error checking saved job:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};