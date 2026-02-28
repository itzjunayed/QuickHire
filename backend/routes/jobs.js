const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/jobs - List all jobs with optional search & filter
router.get('/', [
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('company').optional().trim(),
  query('location').optional().trim(),
  query('type').optional().trim(),
  query('featured').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], async (req, res) => {
  try {
    const { search, category, company, location, type, featured, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicationCount');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/jobs - Create a job (Admin)
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('companyLogo').trim().notEmpty().withMessage('Company logo is required').isURL().withMessage('Company logo must be a valid URL'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('category').isIn(['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources']).withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').optional().isIn(['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']),
  body('tags').optional().isArray(),
  body('featured').optional().isBoolean(),
], handleValidation, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job, message: 'Job created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/jobs/:id - Update a job (Admin)
router.put('/:id', [
  body('title').optional().trim().notEmpty(),
  body('company').optional().trim().notEmpty(),
  body('location').optional().trim().notEmpty(),
  body('category').optional().isIn(['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources']),
  body('type').optional().isIn(['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote']),
], handleValidation, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, data: job, message: 'Job updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/jobs/:id - Delete a job (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/jobs/stats/categories - Get category counts
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/jobs/companies/list - Get all unique companies
router.get('/companies/list', async (req, res) => {
  try {
    const companies = await Job.aggregate([
      { $group: { _id: '$company', logo: { $first: '$companyLogo' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const formattedCompanies = companies.map(c => ({
      name: c._id,
      logo: c.logo,
      jobCount: c.count,
    }));
    res.json({ success: true, data: formattedCompanies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
