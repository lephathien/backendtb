const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const Review = require('../models/Review');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await Instructor.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data...');

    // Read backup data
    const backupPath = path.join(__dirname, '../../techboost/db_backup.json');
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    console.log(`Found ${backupData.courses.length} courses in backup`);

    // Create instructors from courses
    const instructorMap = new Map();
    
    backupData.courses.forEach(course => {
      if (!instructorMap.has(course.instructor)) {
        instructorMap.set(course.instructor, {
          name: course.instructor,
          bio: `Giảng viên chuyên nghiệp với kinh nghiệm giảng dạy ${course.category}`,
          avatar: course.instructor.includes("An") || course.instructor.includes("Hiền") || course.instructor.includes("Hien") 
            ? "/Mr_Hien.png" 
            : `https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=${course.instructor.charAt(0)}`,
          rating: course.rating,
          coursesCount: 1,
          studentsCount: course.studentsCount,
          expertise: course.category,
          skills: course.skills || [],
          experience: Math.floor(Math.random() * 10) + 3 // 3-12 years
        });
      } else {
        const instructor = instructorMap.get(course.instructor);
        instructor.coursesCount += 1;
        instructor.studentsCount += course.studentsCount;
        instructor.rating = (instructor.rating + course.rating) / 2;
      }
    });

    // Insert instructors
    const instructorsToInsert = Array.from(instructorMap.values());
    const createdInstructors = await Instructor.insertMany(instructorsToInsert);
    console.log(`Created ${createdInstructors.length} instructors`);

    // Create instructor lookup
    const instructorLookup = {};
    createdInstructors.forEach(instructor => {
      instructorLookup[instructor.name] = instructor._id;
    });

    // Transform and insert courses
    const coursesToInsert = backupData.courses.map(course => ({
      title: course.title,
      description: course.description,
      instructor: instructorLookup[course.instructor],
      instructorName: course.instructor,
      duration: course.duration,
      price: course.price,
      originalPrice: course.originalPrice,
      image: course.image,
      rating: course.rating,
      studentsCount: course.studentsCount,
      level: course.level,
      category: course.category,
      lessons: course.lessons,
      skills: course.skills || [],
      featured: course.featured || false,
      curriculum: course.curriculum || [],
      learningOutcomes: course.learningOutcomes || [],
      prerequisites: course.prerequisites || [],
      targetAudience: course.targetAudience || []
    }));

    const createdCourses = await Course.insertMany(coursesToInsert);
    console.log(`Created ${createdCourses.length} courses`);

    // Create sample reviews
    const reviews = [];
    const sampleReviews = [
      {
        studentName: 'Lê Văn Nam',
        studentEmail: 'nam.le@example.com',
        rating: 5,
        comment: 'Khóa học rất chi tiết và dễ hiểu. Nội dung được giải thích rất rõ ràng từ cơ bản đến nâng cao.',
        isApproved: true
      },
      {
        studentName: 'Trần Thị Mai',
        studentEmail: 'mai.tran@example.com',
        rating: 4,
        comment: 'Giảng viên nhiệt tình, khóa học bổ ích. Tôi đã học được nhiều kiến thức mới.',
        isApproved: true
      },
      {
        studentName: 'Phạm Văn Đức',
        studentEmail: 'duc.pham@example.com',
        rating: 5,
        comment: 'Khóa học xuất sắc! Đúng như mong đợi và thậm chí còn hơn thế.',
        isApproved: true
      }
    ];

    let reviewIndex = 0;
    createdCourses.forEach(course => {
      sampleReviews.forEach((review) => {
        reviews.push({
          courseId: course._id,
          studentName: review.studentName,
          studentEmail: `student${reviewIndex}@example.com`,
          rating: review.rating,
          comment: review.comment,
          isApproved: review.isApproved,
          userId: new mongoose.Types.ObjectId() // Create unique userId for each review
        });
        reviewIndex++;
      });
    });

    await Review.insertMany(reviews);
    console.log(`Created ${reviews.length} reviews`);

    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
