const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Disable CSP to allow image serving
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://techboost.vn',
    'https://www.techboost.vn'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Debug route to test file access
app.get('/test-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, 'public/uploads');
  
  try {
    const structure = {};
    
    // Read directory structure
    const readDir = (dirPath, relativePath = '') => {
      const items = fs.readdirSync(dirPath);
      return items.map(item => {
        const fullPath = path.join(dirPath, item);
        const relativeItemPath = path.join(relativePath, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          return {
            type: 'directory',
            name: item,
            path: relativeItemPath,
            children: readDir(fullPath, relativeItemPath)
          };
        } else {
          return {
            type: 'file',
            name: item,
            path: relativeItemPath,
            size: stats.size,
            url: `/uploads/${relativeItemPath.replace(/\\/g, '/')}`
          };
        }
      });
    };
    
    const files = readDir(uploadsPath);
    
    res.json({
      success: true,
      uploadsPath,
      files,
      testUrls: [
        `${req.protocol}://${req.get('host')}/uploads/courses/ai.jpeg`,
        `${req.protocol}://${req.get('host')}/uploads/courses/react.webp`
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      uploadsPath
    });
  }
});

// Routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/userInfo'));
app.use('/api/experience-registrations', require('./routes/experienceRegistrations'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/test', require('./routes/test'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TechBoost Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

// Database connection
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TechBoost Backend Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;
