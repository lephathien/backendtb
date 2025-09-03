const mongoose = require('mongoose');
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

// Sample data
const instructors = [
  {
    name: "Nguyễn Văn An",
    bio: "Giảng viên chuyên nghiệp với 2 khóa học và 1930 học viên",
    avatar: "/Mr_Hien.png",
    rating: 4.8,
    coursesCount: 2,
    studentsCount: 1930,
    expertise: "Frontend Developer",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS"],
    experience: 7,
    email: "an.nguyen@techboost.vn",
    phone: "+84 901 234 567"
  },
  {
    name: "Trần Thị Bích",
    bio: "Giảng viên chuyên nghiệp với 1 khóa học và 890 học viên",
    avatar: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=T",
    rating: 4.6,
    coursesCount: 1,
    studentsCount: 890,
    expertise: "Fullstack Developer",
    skills: ["Node.js", "MongoDB", "Express", "JavaScript", "Python"],
    experience: 5,
    email: "bich.tran@techboost.vn",
    phone: "+84 901 234 568"
  },
  {
    name: "Lê Quang Minh",
    bio: "Giảng viên chuyên nghiệp với 1 khóa học và 2100 học viên",
    avatar: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=L",
    rating: 4.9,
    coursesCount: 1,
    studentsCount: 2100,
    expertise: "Data Scientist",
    skills: ["Python", "Pandas", "NumPy", "Machine Learning", "SQL"],
    experience: 8,
    email: "minh.le@techboost.vn",
    phone: "+84 901 234 569"
  }
];

const courses = [
  {
    title: "Khóa học React từ cơ bản đến nâng cao",
    description: "Học React từ những kiến thức cơ bản nhất đến các kỹ thuật nâng cao. Khóa học bao gồm hooks, context API, và các thư viện phổ biến. Xây dựng ứng dụng web hiện đại với React ecosystem.",
    instructor: "Nguyễn Văn An",
    duration: "40 giờ",
    price: 2500000,
    originalPrice: 3500000,
    image: "https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=React+Course",
    rating: 4.8,
    studentsCount: 1250,
    level: "Cơ bản",
    category: "Frontend",
    lessons: 45,
    skills: ["React", "JavaScript", "Hooks", "Context API", "Redux"],
    featured: true,
    learningOutcomes: [
      "Xây dựng ứng dụng React từ cơ bản đến nâng cao",
      "Nắm vững React Hooks và Context API",
      "Quản lý state hiệu quả với Redux",
      "Tối ưu hóa performance của React app",
      "Testing và debugging React components",
      "Triển khai ứng dụng React lên production"
    ],
    prerequisites: [
      "Kiến thức cơ bản về HTML, CSS",
      "Hiểu biết về JavaScript ES6+",
      "Kinh nghiệm với các editor như VS Code"
    ],
    targetAudience: [
      "Developers muốn học React",
      "Frontend developers muốn nâng cao kỹ năng",
      "Sinh viên IT muốn học framework hiện đại",
      "Người chuyển nghề sang lập trình"
    ],
    curriculum: [
      {
        section: "Chương 1: Giới thiệu React",
        lessons: [
          "React là gì và tại sao nên học?",
          "Cài đặt môi trường phát triển",
          "Tạo ứng dụng React đầu tiên",
          "JSX và cách hoạt động",
          "Components và Props cơ bản"
        ]
      },
      {
        section: "Chương 2: State và Event Handling",
        lessons: [
          "State trong React",
          "Event handling và forms",
          "Conditional rendering",
          "Lists và Keys",
          "Component lifecycle"
        ]
      }
    ]
  },
  {
    title: "Node.js & Express Backend Development",
    description: "Xây dựng ứng dụng backend mạnh mẽ với Node.js và Express. Học cách tạo API, xử lý database và authentication. Từ RESTful APIs đến real-time applications với WebSocket.",
    instructor: "Trần Thị Bích",
    duration: "35 giờ",
    price: 2200000,
    originalPrice: 3000000,
    image: "https://via.placeholder.com/400x250/059669/FFFFFF?text=Node.js+Backend",
    rating: 4.6,
    studentsCount: 890,
    level: "Nâng cao",
    category: "Backend",
    lessons: 38,
    skills: ["Node.js", "Express", "MongoDB", "JWT", "REST API"],
    featured: true
  }
];

const reviews = [
  {
    studentName: "Lê Văn Nam",
    rating: 5,
    comment: "Khóa học React rất chi tiết và dễ hiểu. Nội dung được giải thích rất rõ ràng từ cơ bản đến nâng cao. Sau khóa học tôi đã tự tin ứng tuyển vào các vị trí React Developer.",
    studentEmail: "nam.le@example.com"
  },
  {
    studentName: "Phạm Thị Lan",
    rating: 4,
    comment: "Nội dung hay, dự án thực hành rất bổ ích. Hooks và Context API được giải thích rất dễ hiểu.",
    studentEmail: "lan.pham@example.com"
  }
];

// Seed function
const seedData = async () => {
  try {
    // Clear existing data
    await Course.deleteMany();
    await Instructor.deleteMany();
    await Review.deleteMany();

    console.log('Cleared existing data...');

    // Create instructors
    const createdInstructors = await Instructor.insertMany(instructors);
    console.log(`Created ${createdInstructors.length} instructors`);

    // Update courses with instructor IDs
    courses[0].instructorId = createdInstructors[0]._id;
    courses[1].instructorId = createdInstructors[1]._id;

    // Create courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`Created ${createdCourses.length} courses`);

    // Update reviews with course IDs
    reviews[0].courseId = createdCourses[0]._id;
    reviews[1].courseId = createdCourses[0]._id;

    // Create reviews
    const createdReviews = await Review.insertMany(reviews);
    console.log(`Created ${createdReviews.length} reviews`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedData();
});
