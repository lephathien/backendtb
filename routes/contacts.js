const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (Admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by subject
    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    // Search by name or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { message: searchRegex }
      ];
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('repliedBy', 'name email');

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
      count: contacts.length,
      total,
      pagination,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách liên hệ',
      error: error.message
    });
  }
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private (Admin)
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('repliedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin liên hệ',
      error: error.message
    });
  }
});

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public
router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Tên là bắt buộc')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tên không được quá 100 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('phone')
    .optional()
    .custom((value) => {
      if (value && !/^(0|\+84)[3-9][0-9]{8}$/.test(value.replace(/\s/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      return true;
    }),
  body('subject')
    .isIn(['course-inquiry', 'technical-support', 'partnership', 'other'])
    .withMessage('Chủ đề không hợp lệ'),
  body('message')
    .notEmpty()
    .withMessage('Tin nhắn là bắt buộc')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Tin nhắn không được quá 2000 ký tự')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Check for spam (same email in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentContact = await Contact.findOne({
      email: email.toLowerCase(),
      createdAt: { $gte: oneHourAgo }
    });

    if (recentContact) {
      return res.status(429).json({
        success: false,
        message: 'Bạn đã gửi liên hệ gần đây. Vui lòng đợi ít nhất 1 giờ trước khi gửi lại.'
      });
    }

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.',
      data: contact
    });

  } catch (error) {
    console.error('Error creating contact:', error);
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: message.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi gửi liên hệ',
      error: error.message
    });
  }
});

// @desc    Update contact (reply, change status, etc.)
// @route   PATCH /api/contacts/:id
// @access  Private (Admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, replyMessage, notes, priority, repliedBy } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (replyMessage) {
      updateData.replyMessage = replyMessage;
      updateData.repliedAt = new Date();
      if (repliedBy) updateData.repliedBy = repliedBy;
    }
    if (notes !== undefined) updateData.notes = notes;
    if (priority) updateData.priority = priority;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('repliedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật liên hệ',
      error: error.message
    });
  }
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa liên hệ thành công'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa liên hệ',
      error: error.message
    });
  }
});

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private (Admin)
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Contact.getStats();
    
    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get urgent contacts
    const urgentCount = await Contact.countDocuments({
      priority: 'urgent',
      status: { $ne: 'closed' }
    });

    res.json({
      success: true,
      data: {
        ...stats,
        recent: recentCount,
        urgent: urgentCount
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê liên hệ',
      error: error.message
    });
  }
});

module.exports = router;
