const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Course = require('../models/Course');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100; // Hiển thị tất cả courses mặc định
    const startIndex = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Filter by category (support both name and ID)
    if (req.query.category) {
      // Try to find category by name or slug first
      const category = await Category.findOne({
        $or: [
          { name: req.query.category },
          { slug: req.query.category }
        ]
      });
      
      if (category) {
        query.categoryId = category._id;
      } else {
        // Fallback to old string-based category for backward compatibility
        query.category = req.query.category;
      }
    }

    // Filter by level
    if (req.query.level) {
      query.level = req.query.level;
    }

    // Filter by featured
    if (req.query.featured) {
      query.featured = req.query.featured === 'true';
    }

    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Sort
    let sortBy = {};
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
      sortBy[sortField] = sortOrder;
    } else {
      sortBy.createdAt = -1; // Default sort by newest
    }

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('categoryId', 'name slug icon description')
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    // Transform courses to include category name for frontend compatibility
    const transformedCourses = courses.map(course => {
      const courseObj = course.toObject();
      if (courseObj.categoryId) {
        courseObj.category = courseObj.categoryId.name; // Add category name for frontend
        courseObj.categorySlug = courseObj.categoryId.slug;
      }
      courseObj.slug = course.slug; // Đảm bảo luôn trả về slug
      return courseObj;
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
      count: transformedCourses.length,
      total,
      pagination,
      data: transformedCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('categoryId', 'name slug icon description')
      .populate({
        path: 'reviews',
        select: 'rating comment studentName createdAt',
        match: { isApproved: true },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    const courseObj = course.toObject();
    if (courseObj.categoryId) {
      courseObj.category = courseObj.categoryId.name;
      courseObj.categorySlug = courseObj.categoryId.slug;
    }
    courseObj.slug = course.slug;
    res.status(200).json({ success: true, data: courseObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('categoryId', 'name slug icon description')
      .populate({
        path: 'reviews',
        select: 'rating comment studentName createdAt',
        match: { isApproved: true },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Transform course to include category name for frontend compatibility
    const courseObj = course.toObject();
    if (courseObj.categoryId) {
      courseObj.category = courseObj.categoryId.name;
      courseObj.categorySlug = courseObj.categoryId.slug;
    }
    courseObj.slug = course.slug; // Đảm bảo luôn trả về slug

    res.status(200).json({
      success: true,
      data: courseObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin)
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('instructor').notEmpty().withMessage('Instructor is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('originalPrice').isNumeric().withMessage('Original price must be a number'),
  body('level').isIn(['Cơ bản', 'Nâng cao', 'Chuyên gia']).withMessage('Invalid level'),
  body('category').notEmpty().withMessage('Category is required'),
  body('lessons').isNumeric().withMessage('Lessons must be a number'),
  body('skills').isArray().withMessage('Skills must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Update course (hợp lý, hỗ trợ mọi trường, đồng bộ category)
// @route   PATCH /api/courses/:id
// @access  Private (Admin)
router.patch('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    console.log('PATCH COURSE - req.params.id:', req.params.id);
    console.log('PATCH COURSE - updateData:', updateData);

    // Nếu có trường category (tên), tìm categoryId
    if (updateData.category) {
      const categoryDoc = await Category.findOne({ name: updateData.category });
      if (categoryDoc) {
        updateData.categoryId = categoryDoc._id;
      }
      // Không lưu trường category string vào DB
      delete updateData.category;
    }

    // Nếu có title mới, tự động cập nhật slug
    if (updateData.title) {
      const slugify = require('../utils/slugify');
      updateData.slug = slugify(updateData.title);
    }

    // Không cho sửa _id
    delete updateData._id;

    // Validate: không cho sửa rating trực tiếp (tính từ reviews)
    delete updateData.rating;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      console.error('PATCH COURSE - Not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        id: req.params.id,
        updateData
      });
    }

    // Trả về dữ liệu chuẩn, thêm category name
    let courseObj = course.toObject();
    if (courseObj.categoryId) {
      const cat = await Category.findById(courseObj.categoryId);
      if (cat) courseObj.category = cat.name;
    }

    res.status(200).json({
      success: true,
      data: courseObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Toggle course active status
// @route   PATCH /api/courses/:id/toggle-active
// @access  Private (Admin)
router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const { isActive } = req.body;
    console.log('TOGGLE COURSE ACTIVE - courseId:', req.params.id);
    console.log('TOGGLE COURSE ACTIVE - isActive:', isActive);

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Toggle the active status
    course.isActive = !isActive; // Toggle to opposite of current state
    await course.save();

    console.log('TOGGLE COURSE ACTIVE - New status:', course.isActive);

    res.status(200).json({
      success: true,
      data: {
        isActive: course.isActive
      }
    });
  } catch (error) {
    console.error('TOGGLE COURSE ACTIVE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Soft delete
    course.isActive = false;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get course reviews
// @route   GET /api/courses/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Review.countDocuments({ 
      courseId: req.params.id, 
      isApproved: true 
    });

    const reviews = await Review.find({ 
      courseId: req.params.id, 
      isApproved: true 
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

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
      count: reviews.length,
      total,
      pagination,
      data: reviews
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
