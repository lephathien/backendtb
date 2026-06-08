const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: tự động tăng lớp nếu đã qua tháng 10 (chỉ áp dụng cho 1-16)
async function bumpGrade(user) {
  if (!user.grade || user.grade > 16) return;
  const now = new Date();
  if (now.getMonth() >= 9) {
    const lastUpdate = user.gradeUpdatedAt || user.createdAt;
    if (lastUpdate && lastUpdate.getFullYear() < now.getFullYear()) {
      user.grade += 1;
      user.gradeUpdatedAt = now;
      await user.save();
    }
  }
}

// @desc    Register user (student, instructor, admin)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, grade, phone } = req.body;
    if (!name || !email || !password || !grade || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, grade and phone' });
    }
    if (name.trim().split(/\s+/).length < 2) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ họ và tên' });
    }
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      grade,
      gradeUpdatedAt: new Date(),
      phone
    });
    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        phone: user.phone,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @desc    Login user (student, instructor, admin)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    // Tự động tăng lớp nếu đến kỳ
    await bumpGrade(user);
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        grade: user.grade,
        phone: user.phone,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // In a real app, you would verify JWT token from headers

    res.status(200).json({
      success: true,
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        enrolledCourses: [],
        completedCourses: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // In a real app, you would invalidate the JWT token

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
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
