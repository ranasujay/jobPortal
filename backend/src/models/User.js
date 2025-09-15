const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    default: 'candidate'
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone number cannot be more than 20 characters']
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    current_position: {
      type: String,
      maxlength: [100, 'Current position cannot be more than 100 characters']
    },
    experience_level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
    },
    skills: [{
      type: String,
      trim: true,
      maxlength: [50, 'Skill name cannot be more than 50 characters']
    }],
    education: {
      type: String,
      maxlength: [1000, 'Education cannot be more than 1000 characters']
    },
    portfolio_links: [{
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please provide valid URLs starting with http:// or https://'
      ]
    }],
    resume: String
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);