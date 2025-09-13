const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Core references
  applicant: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Application must have an applicant']
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: [true, 'Application must be for a job']
  },
  
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  
  // Application information
  applicant_info: {
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters']
    }
  },
  
  // Application documents
  documents: {
    resume: {
      cloudinary_id: String,
      secure_url: String,
      original_filename: String,
      file_size: Number,
      uploaded_at: {
        type: Date,
        default: Date.now
      }
    },
    cover_letter: {
      cloudinary_id: String,
      secure_url: String,
      original_filename: String,
      file_size: Number,
      uploaded_at: {
        type: Date,
        default: Date.now
      }
    }
  },
  
  // Additional application information
  cover_letter_text: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  
  additional_info: {
    type: String,
    maxlength: [1000, 'Additional information cannot be more than 1000 characters']
  },
  
  // Application metadata
  applied_at: {
    type: Date,
    default: Date.now
  },
  
  status_updated_at: {
    type: Date,
    default: Date.now
  },
  
  status_updated_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Interview information
  interview: {
    scheduled_at: Date,
    location: String,
    notes: String,
    feedback: String
  },
  
  // Recruiter notes
  recruiter_notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  
  // Withdrawal information
  withdrawn: {
    type: Boolean,
    default: false
  },
  
  withdrawn_at: Date,
  
  withdrawal_reason: String
  
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ applied_at: -1 });

// Update status_updated_at when status changes
applicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.status_updated_at = new Date();
  }
  next();
});

// Virtual for application age
applicationSchema.virtual('applicationAge').get(function() {
  return Math.floor((Date.now() - this.applied_at) / (1000 * 60 * 60 * 24)); // Days
});

// Method to check if application can be withdrawn
applicationSchema.methods.canBeWithdrawn = function() {
  return ['pending', 'reviewing'].includes(this.status) && !this.withdrawn;
};

// Method to check if status can be updated
applicationSchema.methods.canUpdateStatus = function() {
  return !this.withdrawn && this.status !== 'accepted' && this.status !== 'rejected';
};

module.exports = mongoose.model('Application', applicationSchema);