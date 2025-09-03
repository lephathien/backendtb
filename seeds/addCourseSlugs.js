const mongoose = require('mongoose');
const Course = require('../models/Course');
const slugify = require('../utils/slugify');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/techboost';

async function addSlugs() {
  await mongoose.connect(MONGO_URI);
  const courses = await Course.find({});
  let updated = 0;
  for (const course of courses) {
    if (!course.slug) {
      course.slug = slugify(course.title);
      await course.save();
      updated++;
    }
  }
  console.log(`Đã cập nhật slug cho ${updated} khóa học.`);
  await mongoose.disconnect();
}

addSlugs().catch(err => {
  console.error(err);
  process.exit(1);
});
