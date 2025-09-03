const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('../models/Course');

// Mapping ảnh với khóa học
const courseImageMapping = [
  {
    title: "HTML/CSS từ cơ bản đến nâng cao",
    image: "/uploads/courses/html_css.jpeg",
    category: "Frontend"
  },
  {
    title: "JavaScript ES6+ và DOM Manipulation", 
    image: "/uploads/courses/javascript.png",
    category: "Frontend"
  },
  {
    title: "React.js - Xây dựng ứng dụng web hiện đại",
    image: "/uploads/courses/react.webp", 
    category: "Frontend"
  },
  {
    title: "Next.js Full-Stack Development",
    image: "/uploads/courses/nextjs.png",
    category: "Frontend"
  },
  {
    title: "Node.js Backend Development",
    image: "/uploads/courses/nodejs.jpg",
    category: "Backend"
  },
  {
    title: "Python cơ bản cho người mới bắt đầu",
    image: "/uploads/courses/python_co_ban.png",
    category: "Backend"
  },
  {
    title: "Trí tuệ nhân tạo và Machine Learning",
    image: "/uploads/courses/ai.jpeg",
    category: "Ứng dụng AI"
  },
  {
    title: "Data Science với Python",
    image: "/uploads/courses/data-science.jpg",
    category: "Data Science"
  },
  {
    title: "Flutter - Phát triển ứng dụng di động",
    image: "/uploads/courses/flutter.jpeg",
    category: "Mobile"
  },
  {
    title: "Scratch - Lập trình cho trẻ em",
    image: "/uploads/courses/scratch.jpg",
    category: "Lập trình Kids"
  },
  {
    title: "Scratch nâng cao - Game Development",
    image: "/uploads/courses/scratch2.jpg", 
    category: "Lập trình Kids"
  }
];

async function updateCourseImages() {
  try {
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost');
    console.log('✅ Connected to MongoDB');

    // Lấy danh sách khóa học hiện có
    const existingCourses = await Course.find({});
    console.log(`📚 Found ${existingCourses.length} existing courses`);

    let updatedCount = 0;
    let createdCount = 0;

    for (const courseData of courseImageMapping) {
      // Tìm khóa học theo title hoặc category
      let course = await Course.findOne({
        $or: [
          { title: { $regex: courseData.title, $options: 'i' } },
          { title: { $regex: courseData.title.split(' ')[0], $options: 'i' } }
        ]
      });

      if (course) {
        // Cập nhật ảnh cho khóa học có sẵn
        await Course.findByIdAndUpdate(course._id, {
          image: courseData.image,
          category: courseData.category
        });
        console.log(`🔄 Updated image for: ${course.title}`);
        updatedCount++;
      } else {
        // Tạo khóa học mới nếu chưa có
        const newCourse = new Course({
          title: courseData.title,
          image: courseData.image,
          category: courseData.category,
          description: `Khóa học ${courseData.title} với nội dung chất lượng cao, được thiết kế phù hợp với người học Việt Nam.`,
          price: Math.floor(Math.random() * 2000000) + 1000000, // Random price 1-3M
          originalPrice: Math.floor(Math.random() * 3000000) + 2000000, // Random original price 2-5M
          duration: `${Math.floor(Math.random() * 40) + 20} giờ`, // Random duration 20-60h
          level: ['Cơ bản', 'Nâng cao', 'Chuyên gia'][Math.floor(Math.random() * 3)],
          lessons: Math.floor(Math.random() * 50) + 20, // Random lessons 20-70
          skills: courseData.title.split(' ').slice(0, 3),
          learningOutcomes: [
            'Hiểu rõ kiến thức cơ bản và nâng cao',
            'Thực hành với các dự án thực tế',
            'Xây dựng portfolio cá nhân',
            'Chuẩn bị cho công việc thực tế'
          ],
          prerequisites: ['Máy tính có kết nối internet', 'Tinh thần học tập tích cực'],
          targetAudience: [
            'Người mới bắt đầu học lập trình',
            'Sinh viên công nghệ thông tin',
            'Người muốn chuyển đổi nghề nghiệp'
          ],
          curriculum: [
            {
              section: 'Giới thiệu và cài đặt',
              lessons: [
                'Tổng quan về khóa học',
                'Cài đặt môi trường phát triển',
                'Bài tập đầu tiên'
              ]
            },
            {
              section: 'Kiến thức cơ bản',
              lessons: [
                'Cú pháp cơ bản',
                'Biến và kiểu dữ liệu',
                'Điều kiện và vòng lặp',
                'Bài tập thực hành'
              ]
            },
            {
              section: 'Dự án thực tế',
              lessons: [
                'Phân tích yêu cầu dự án',
                'Thiết kế và code',
                'Testing và deployment',
                'Presentation và feedback'
              ]
            }
          ],
          featured: Math.random() > 0.7, // 30% chance to be featured
          isActive: true
        });

        await newCourse.save();
        console.log(`✨ Created new course: ${courseData.title}`);
        createdCount++;
      }
    }

    console.log('\n🎉 Update completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Updated courses: ${updatedCount}`);
    console.log(`   - Created courses: ${createdCount}`);
    console.log(`   - Total courses: ${updatedCount + createdCount}`);

    // Hiển thị danh sách khóa học với ảnh
    const allCourses = await Course.find({}).select('title image category price');
    console.log('\n📚 Courses with images:');
    allCourses.forEach(course => {
      console.log(`   • ${course.title}`);
      console.log(`     Image: ${course.image}`);
      console.log(`     Category: ${course.category}`);
      console.log(`     Price: ${course.price?.toLocaleString('vi-VN')}đ`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error updating course images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Chạy script
updateCourseImages();
