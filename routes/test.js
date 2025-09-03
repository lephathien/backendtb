const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema cho test document
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', TestSchema);

// Create - Test tạo document
router.post('/create', async (req, res) => {
  try {
    const test = new Test({ name: 'Test Document' });
    await test.save();
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Read - Test đọc documents
router.get('/read', async (req, res) => {
  try {
    const tests = await Test.find().limit(5);
    res.json({ success: true, data: tests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update - Test cập nhật document
router.put('/update/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { name: 'Updated Document' },
      { new: true }
    );
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete - Test xóa document
router.delete('/delete/:id', async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: test });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test connection status
router.get('/status', async (req, res) => {
  try {
    const status = {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections),
    };
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
