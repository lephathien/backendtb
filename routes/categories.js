const express = require('express');
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get categories from database with updated course counts
    let categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // If no categories in database, create default ones
    if (categories.length === 0) {
      const defaultCategories = [
        {
          name: 'Frontend',
          slug: 'frontend',
          icon: '💻',
          description: 'Học phát triển giao diện website hiện đại'
        },
        {
          name: 'Backend',
          slug: 'backend',
          icon: '⚙️',
          description: 'Xây dựng hệ thống backend mạnh mẽ'
        },
        {
          name: 'Data Science',
          slug: 'data-science',
          icon: '📊',
          description: 'Phân tích dữ liệu và machine learning'
        },
        {
          name: 'Design',
          slug: 'design',
          icon: '🎨',
          description: 'Thiết kế UI/UX chuyên nghiệp'
        },
        {
          name: 'Mobile',
          slug: 'mobile',
          icon: '📱',
          description: 'Phát triển ứng dụng di động'
        },
        {
          name: 'Ứng dụng AI',
          slug: 'ung-dung-ai',
          icon: '🤖',
          description: 'Ứng dụng AI trong công việc thực tế'
        },
        {
          name: 'Lập trình Kids',
          slug: 'lap-trinh-kids',
          icon: '👶',
          description: 'Lập trình dành cho trẻ em'
        },
        {
          name: 'DevOps',
          slug: 'devops',
          icon: '�',
          description: 'Triển khai và vận hành hệ thống'
        }
      ];
      
      categories = await Category.insertMany(defaultCategories);
      console.log('Created default categories');
    }

    // Calculate course counts for each category
    const categoryCounts = await Course.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]);

    // Create a map of category counts
    const countMap = {};
    categoryCounts.forEach(item => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    // Add count to each category
    const categoriesWithCount = categories.map(category => {
      const categoryObj = category.toObject();
      categoryObj.count = countMap[category._id.toString()] || 0;
      return categoryObj;
    });

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    
    // If not found by ID, try to find by name (for compatibility)
    if (!category) {
      category = await Category.findOne({ name: req.params.id });
    }
    
    // If still not found, generate from courses
    if (!category) {
      const courseCount = await Course.countDocuments({ 
        category: req.params.id,
        isActive: true 
      });
      
      if (courseCount > 0) {
        const categoryIcons = {
          'Frontend': '💻',
          'Backend': '⚙️',
          'Data Science': '📊',
          'Design': '🎨',
          'Mobile': '📱',
          'Ứng dụng AI': '🤖',
          'Lập trình Kids': '👶',
          'DevOps': '🔧'
        };
        
        const categoryDescriptions = {
          'Frontend': 'Học phát triển giao diện website hiện đại',
          'Backend': 'Xây dựng hệ thống backend mạnh mẽ',
          'Data Science': 'Phân tích dữ liệu và machine learning',
          'Design': 'Thiết kế UI/UX chuyên nghiệp',
          'Mobile': 'Phát triển ứng dụng di động',
          'Ứng dụng AI': 'Ứng dụng AI trong công việc thực tế',
          'Lập trình Kids': 'Lập trình dành cho trẻ em',
          'DevOps': 'Triển khai và vận hành hệ thống'
        };
        
        category = {
          _id: req.params.id,
          name: req.params.id,
          icon: categoryIcons[req.params.id] || '📚',
          description: categoryDescriptions[req.params.id] || `Khóa học ${req.params.id}`,
          count: courseCount,
          isActive: true
        };
      }
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get courses by category
// @route   GET /api/categories/:identifier/courses
// @access  Public
router.get('/:identifier/courses', async (req, res) => {
  try {
    let category;
    
    // Try to find by ObjectId first
    if (mongoose.Types.ObjectId.isValid(req.params.identifier)) {
      category = await Category.findById(req.params.identifier);
    }
    
    // If not found by ID, try by name or slug
    if (!category) {
      category = await Category.findOne({
        $or: [
          { name: req.params.identifier },
          { slug: req.params.identifier }
        ]
      });
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Find courses by categoryId
    const courses = await Course.find({ 
      categoryId: category._id,
      isActive: true 
    }).populate('categoryId', 'name slug icon description')
      .populate('instructor', 'name avatar expertise')
      .sort({ createdAt: -1 });

    // Transform courses to include category name for frontend compatibility
    const transformedCourses = courses.map(course => {
      const courseObj = course.toObject();
      if (courseObj.categoryId) {
        courseObj.category = courseObj.categoryId.name;
        courseObj.categorySlug = courseObj.categoryId.slug;
      }
      return courseObj;
    });

    res.status(200).json({
      success: true,
      count: transformedCourses.length,
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

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
router.post('/', [
  body('name').notEmpty().withMessage('Tên danh mục không được để trống'),
  body('description').optional(),
  body('icon').optional(),
  body('isActive').optional().isBoolean().withMessage('isActive phải là boolean')
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

    const { name, description, icon, isActive } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục này đã tồn tại'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    const category = await Category.create({
      name,
      description: description || '',
      icon: icon || '📚',
      slug,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private (Admin)
router.patch('/:id', [
  body('name').optional().notEmpty().withMessage('Tên danh mục không được để trống'),
  body('description').optional(),
  body('icon').optional(),
  body('isActive').optional().isBoolean().withMessage('isActive phải là boolean')
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

    const { name, description, icon, isActive } = req.body;
    const updateData = {};

    if (name) {
      // Check if new name conflicts with existing category
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục này đã tồn tại'
        });
      }

      updateData.name = name;
      // Generate new slug from name
      updateData.slug = name.toLowerCase()
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category
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
