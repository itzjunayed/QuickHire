const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required'],
  },
  name: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL starting with http:// or https://'],
  },
  coverNote: {
    type: String,
    required: [true, 'Cover note is required'],
    maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Application', applicationSchema);
