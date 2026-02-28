const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'],
  },
  type: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'],
    default: 'Full Time',
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: {
    type: String,
    default: '',
  },
  salary: {
    type: String,
    default: '',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Virtual for application count
jobSchema.virtual('applicationCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job',
  count: true,
});

jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
