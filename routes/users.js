const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Lấy danh sách user (ẩn password)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


