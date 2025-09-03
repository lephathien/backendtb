const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure upload directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type } = req.params; // courses, instructors, testimonials
    const uploadPath = path.join(__dirname, '../public/uploads', type);
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Giữ nguyên tên file gốc
    cb(null, file.originalname);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/:type
// @desc    Upload single image file
// @access  Public (should be protected in production)
router.post('/:type', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type } = req.params;
    const allowedTypes = ['courses', 'instructors', 'testimonials'];
    
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type. Allowed: courses, instructors, testimonials'
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/${type}/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/:type/:filename
// @desc    Delete uploaded file
// @access  Public (should be protected in production)
router.delete('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../public/uploads', type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
});

// @route   GET /api/upload/:type
// @desc    List uploaded files
// @access  Public
router.get('/:type', (req, res) => {
  try {
    const { type } = req.params;
    const uploadPath = path.join(__dirname, '../public/uploads', type);

    if (!fs.existsSync(uploadPath)) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(uploadPath).map(filename => {
      const filePath = path.join(uploadPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        url: `/uploads/${type}/${filename}`,
        fullUrl: `${req.protocol}://${req.get('host')}/uploads/${type}/${filename}`,
        size: stats.size,
        uploadedAt: stats.birthtime
      };
    });

    res.status(200).json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list files',
      error: error.message
    });
  }
});

module.exports = router;
