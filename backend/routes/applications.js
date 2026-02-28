const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// POST /api/applications - Submit a job application
router.post('/', [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('resumeLink').trim().notEmpty().withMessage('Resume link is required').isURL().withMessage('Resume link must be a valid URL'),
  body('coverNote').trim().notEmpty().withMessage('Cover note is required').isLength({ max: 2000 }).withMessage('Cover note cannot exceed 2000 characters'),
], handleValidation, async (req, res) => {
  try {
    const { jobId, name, email, resumeLink, coverNote } = req.body;

    // Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = await Application.create({
      job: jobId,
      name,
      email,
      resumeLink,
      coverNote,
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully! We will get back to you soon.',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/applications - Get all applications (Admin)
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/applications/job/:jobId - Get applications for a specific job (Admin)
router.get('/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('job', 'title company')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
