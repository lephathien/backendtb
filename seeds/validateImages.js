const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Course = require('../models/Course');

async function validateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost');
    console.log('✅ Connected to MongoDB');

    const courses = await Course.find({}).select('title image category');
    console.log(`\n📊 Validating ${courses.length} course images...\n`);

    let validCount = 0;
    let invalidCount = 0;

    for (const course of courses) {
      const imagePath = course.image;
      
      if (imagePath.startsWith('/uploads/')) {
        // Check if local file exists
        const fullPath = path.join(__dirname, '..', 'public', imagePath);
        const exists = fs.existsSync(fullPath);
        
        if (exists) {
          const stats = fs.statSync(fullPath);
          console.log(`✅ ${course.title}`);
          console.log(`   📁 ${imagePath}`);
          console.log(`   📏 Size: ${(stats.size / 1024).toFixed(1)}KB`);
          console.log(`   🔗 URL: http://localhost:5001${imagePath}`);
          console.log(`   📂 Category: ${course.category}`);
          validCount++;
        } else {
          console.log(`❌ ${course.title}`);
          console.log(`   📁 Missing: ${imagePath}`);
          invalidCount++;
        }
      } else {
        console.log(`⚠️  ${course.title}`);
        console.log(`   🌐 External: ${imagePath}`);
        invalidCount++;
      }
      console.log('');
    }

    console.log(`\n🎯 Validation Summary:`);
    console.log(`   ✅ Valid local images: ${validCount}`);
    console.log(`   ❌ Invalid/Missing: ${invalidCount}`);
    console.log(`   📈 Success rate: ${((validCount / courses.length) * 100).toFixed(1)}%`);

    if (validCount === courses.length) {
      console.log(`\n🎉 All course images are properly configured!`);
      console.log(`🌐 Test any image: http://localhost:5001/uploads/courses/ai.jpeg`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

validateImages();
