const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('../models/Course');

// Simplified script để chỉ cập nhật ảnh
async function updateOnlyImages() {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost');
    console.log('✅ Connected to MongoDB');

    // Mapping ảnh theo từ khóa trong title
    const imageMapping = {
      'html': '/uploads/courses/html_css.jpeg',
      'css': '/uploads/courses/html_css.jpeg',
      'javascript': '/uploads/courses/javascript.png',
      'react': '/uploads/courses/react.webp',
      'next': '/uploads/courses/nextjs.png',
      'node': '/uploads/courses/nodejs.jpg',
      'python': '/uploads/courses/python_co_ban.png',
      'ai': '/uploads/courses/ai.jpeg',
      'machine': '/uploads/courses/ai.jpeg',
      'data': '/uploads/courses/data-science.jpg',
      'flutter': '/uploads/courses/flutter.jpeg',
      'scratch': '/uploads/courses/scratch.jpg',
      'mobile': '/uploads/courses/flutter.jpeg'
    };

    // Lấy tất cả khóa học
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses`);

    let updatedCount = 0;

    for (const course of courses) {
      let imageUrl = null;
      const title = course.title.toLowerCase();

      // Tìm ảnh phù hợp dựa trên title
      for (const [keyword, image] of Object.entries(imageMapping)) {
        if (title.includes(keyword)) {
          imageUrl = image;
          break;
        }
      }

      // Cập nhật ảnh nếu tìm thấy
      if (imageUrl) {
        await Course.findByIdAndUpdate(course._id, { image: imageUrl });
        console.log(`🔄 Updated image for: ${course.title} -> ${imageUrl}`);
        updatedCount++;
      } else {
        console.log(`⚠️  No image found for: ${course.title}`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} courses with images`);

    // Hiển thị kết quả
    const updatedCourses = await Course.find({}).select('title image category');
    console.log('\n📚 All courses with their images:');
    updatedCourses.forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     Image: ${course.image}`);
      console.log(`     Category: ${course.category}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Chạy script
updateOnlyImages();
