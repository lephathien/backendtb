const express = require('express');
const router = express.Router();

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const testimonial = testimonials.find(t => t.id === parseInt(req.params.id));

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
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
