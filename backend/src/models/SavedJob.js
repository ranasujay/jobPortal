const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Saved job must belong to a user']
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: [true, 'Must specify a job to save']
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate saves
savedJobSchema.index({ user: 1, job: 1 }, { unique: true });

// Populate job details when querying
savedJobSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'job',
    populate: {
      path: 'company',
      select: 'name logo location'
    }
  });
  next();
});

module.exports = mongoose.model('SavedJob', savedJobSchema);