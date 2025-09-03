const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;

    let query = { isActive: true };

    // Search by name or expertise
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { expertise: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by expertise
    if (req.query.expertise) {
      query.expertise = { $regex: req.query.expertise, $options: 'i' };
    }

    // Sort
    let sortBy = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sortBy[sortField] = sortOrder;
    } else {
      sortBy.rating = -1; // Default sort by highest rating
    }

    const total = await Instructor.countDocuments(query);
    const instructors = await Instructor.find(query)
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'courses',
        select: 'title rating studentsCount',
        match: { isActive: true }
      });

    // Pagination result
    const pagination = {};
    
    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: instructors.length,
      total,
      pagination,
      data: instructors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate({
      path: 'courses',
      select: 'title description price originalPrice image rating studentsCount level category',
      match: { isActive: true }
    });

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Create new instructor
// @route   POST /api/instructors
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const instructor = await Instructor.create(req.body);

    res.status(201).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    // Soft delete
    instructor.isActive = false;
    await instructor.save();

    res.status(200).json({
      success: true,
      message: 'Instructor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
