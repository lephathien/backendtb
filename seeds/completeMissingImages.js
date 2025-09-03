const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('../models/Course');

async function addMissingImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost');
    console.log('✅ Connected to MongoDB');

    // Tạo ảnh cho những khóa học còn thiếu
    const missingImageUpdates = [
      {
        title: 'UI/UX Design với Figma',
        image: '/uploads/courses/data-science.jpg' // Tạm dùng ảnh data-science
      },
      {
        title: 'Git & GitHub từ cơ bản đến chuyên nghiệp',
        image: '/uploads/courses/nodejs.jpg' // Tạm dùng ảnh nodejs
      }
    ];

    for (const update of missingImageUpdates) {
      const course = await Course.findOne({ 
        title: { $regex: update.title, $options: 'i' } 
      });
      
      if (course) {
        await Course.findByIdAndUpdate(course._id, { image: update.image });
        console.log(`🔄 Updated ${update.title} with image: ${update.image}`);
      }
    }

    // Kiểm tra tất cả courses có ảnh local
    const allCourses = await Course.find({}).select('title image');
    console.log('\n📊 Final image status:');
    
    allCourses.forEach(course => {
      const isLocal = course.image.startsWith('/uploads/');
      const status = isLocal ? '✅' : '⚠️ ';
      console.log(`${status} ${course.title}`);
      console.log(`    Image: ${course.image}`);
    });

    console.log('\n🎯 Summary:');
    const localImages = allCourses.filter(c => c.image.startsWith('/uploads/')).length;
    const totalCourses = allCourses.length;
    console.log(`Local images: ${localImages}/${totalCourses}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addMissingImages();
