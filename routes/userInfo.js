const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware xác thực token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/users/me - Lấy info user + danh sách khóa học đã đăng ký
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Lấy danh sách khóa học đã đăng ký
    const courses = user.enrolledCourses && user.enrolledCourses.length > 0
      ? await Course.find({ _id: { $in: user.enrolledCourses } })
      : [];
    res.json({
      user: {
        ...user,
        enrolledCourses: courses
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
