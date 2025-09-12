const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide company description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please provide company location'],
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  logo_url: {
    type: String,
    default: 'https://via.placeholder.com/100x100?text=Logo'
  },
  industry: {
    type: String,
    required: [true, 'Please provide industry'],
    maxlength: [50, 'Industry cannot be more than 50 characters']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: [true, 'Please provide company size']
  },
  founded: {
    type: Number,
    min: [1800, 'Founded year cannot be before 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);