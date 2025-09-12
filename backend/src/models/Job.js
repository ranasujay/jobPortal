const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements'],
    maxlength: [3000, 'Requirements cannot be more than 3000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location'],
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  salary_min: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  salary_max: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  job_type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
    required: [true, 'Please provide job type']
  },
  experience_level: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: [true, 'Please provide experience level']
  },
  skills: [{
    type: String,
    trim: true
  }],
  benefits: {
    type: String,
    maxlength: [2000, 'Benefits cannot be more than 2000 characters']
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: [true, 'Job must belong to a company']
  },
  posted_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Job must have a poster']
  },
  applications: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    applied_at: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  expires_at: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  skills: 'text'
});

module.exports = mongoose.model('Job', jobSchema);