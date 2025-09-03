const mongoose = require('mongoose');
const Course = require('../models/Course');
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

// Curriculum tiếng Việt cho từng khóa học
const vietnameseCurriculums = {
  "Khóa học React từ cơ bản đến nâng cao": [
    {
      section: "Chương 1: Giới thiệu về React",
      lessons: [
        "Tại sao chọn React? So sánh với các framework khác",
        "Cài đặt môi trường phát triển và Create React App",
        "JSX và Virtual DOM - Khái niệm cơ bản",
        "Components và Props - Xây dựng thành phần giao diện",
        "Cách hoạt động của Rendering và Re-rendering",
        "Xử lý sự kiện trong React"
      ]
    },
    {
      section: "Chương 2: Làm việc với React Components",
      lessons: [
        "Phân biệt Function Components và Class Components",
        "Quản lý State với useState Hook",
        "Truyền dữ liệu với Props và PropTypes",
        "Vòng đời Component và sử dụng useEffect",
        "Hiển thị có điều kiện (Conditional Rendering)",
        "Làm việc với danh sách và Keys"
      ]
    },
    {
      section: "Chương 3: Nắm vững React Hooks",
      lessons: [
        "Tìm hiểu sâu về useState và useEffect",
        "Sử dụng useContext để quản lý trạng thái",
        "useReducer cho quản lý state phức tạp",
        "Tối ưu hóa với useMemo và useCallback",
        "Tạo và sử dụng Custom Hooks",
        "Quy tắc sử dụng Hooks hiệu quả"
      ]
    },
    {
      section: "Chương 4: Quản lý trạng thái ứng dụng",
      lessons: [
        "Context API và mô hình Provider",
        "Kiến thức nền tảng về Redux",
        "Sử dụng Redux Toolkit (RTK) hiện đại",
        "Xử lý bất đồng bộ với Redux Thunk",
        "Sử dụng Redux DevTools để debug",
        "Thực hành tốt nhất cho quản lý state"
      ]
    },
    {
      section: "Chương 5: Chủ đề nâng cao",
      lessons: [
        "React Router để xây dựng SPA",
        "Xử lý form với Formik/React Hook Form",
        "Tích hợp API với Axios",
        "Error Boundaries - Xử lý lỗi",
        "Phân chia code và Lazy Loading",
        "Testing với Jest và React Testing Library"
      ]
    },
    {
      section: "Chương 6: Dự án thực tế",
      lessons: [
        "Xây dựng ứng dụng Todo với Local Storage",
        "Tạo Dashboard thời tiết với API",
        "Xây dựng catalog sản phẩm E-commerce",
        "Hệ thống CMS Blog với CRUD",
        "Dashboard mạng xã hội",
        "Triển khai lên Netlify/Vercel"
      ]
    }
  ],
  
  "Node.js & Express Backend Development": [
    {
      section: "Chương 1: Nền tảng Node.js",
      lessons: [
        "Giới thiệu Node.js và kiến trúc Event-driven",
        "Quản lý packages với NPM",
        "Làm việc với File System và Path modules",
        "HTTP module và tạo server đơn giản",
        "Event Emitters và Streams",
        "Lập trình bất đồng bộ: Callbacks, Promises, Async/Await"
      ]
    },
    {
      section: "Chương 2: Framework Express.js",
      lessons: [
        "Cài đặt và cấu hình Express",
        "Routing và Route parameters",
        "Middleware và xử lý lỗi",
        "Đối tượng Request và Response",
        "Template engines (EJS, Handlebars)",
        "Phục vụ file tĩnh và public assets"
      ]
    },
    {
      section: "Chương 3: Tích hợp cơ sở dữ liệu",
      lessons: [
        "MongoDB cơ bản và MongoDB Atlas",
        "Mongoose ODM và thiết kế Schema",
        "Thao tác CRUD với Mongoose",
        "Xác thực và làm sạch dữ liệu",
        "Mối quan hệ database và population",
        "Aggregation pipeline"
      ]
    },
    {
      section: "Chương 4: Xác thực và bảo mật",
      lessons: [
        "Chiến lược xác thực người dùng",
        "Triển khai JSON Web Tokens (JWT)",
        "Mã hóa mật khẩu với bcrypt",
        "Quản lý phiên đăng nhập",
        "OAuth 2.0 và đăng nhập mạng xã hội",
        "Thực hành tốt nhất về bảo mật API"
      ]
    },
    {
      section: "Chương 5: Chủ đề nâng cao",
      lessons: [
        "Nguyên tắc thiết kế RESTful API",
        "Tài liệu API với Swagger",
        "Upload file và xử lý hình ảnh",
        "Gửi email với Nodemailer",
        "WebSocket và giao tiếp real-time",
        "Caching với Redis"
      ]
    },
    {
      section: "Chương 6: Triển khai và vận hành",
      lessons: [
        "Biến môi trường và cấu hình",
        "Logging và monitoring",
        "Testing API với Jest và Supertest",
        "Containerization với Docker",
        "Triển khai lên Heroku, AWS, DigitalOcean",
        "CI/CD pipeline với GitHub Actions"
      ]
    }
  ],

  "Python cho Data Science & Machine Learning": [
    {
      section: "Chương 1: Python cho Data Science cơ bản",
      lessons: [
        "Thiết lập môi trường: Anaconda, Jupyter Notebook",
        "Ôn tập Python cơ bản: kiểu dữ liệu, vòng lặp, hàm",
        "Giới thiệu hệ sinh thái Data Science",
        "Môi trường ảo và quản lý packages",
        "Git và kiểm soát phiên bản cho Data Science",
        "Thực hành tốt nhất cho dự án Data Science"
      ]
    },
    {
      section: "Chương 2: Thao tác dữ liệu với Pandas",
      lessons: [
        "Pandas cơ bản: Series và DataFrame",
        "Đọc dữ liệu: CSV, JSON, Excel, SQL databases",
        "Làm sạch dữ liệu và xử lý giá trị thiếu",
        "Biến đổi dữ liệu và feature engineering",
        "Thao tác GroupBy và aggregations",
        "Xử lý dữ liệu chuỗi thời gian"
      ]
    },
    {
      section: "Chương 3: Tính toán số học với NumPy",
      lessons: [
        "NumPy arrays và các phép toán",
        "Broadcasting và vectorization",
        "Đại số tuyến tính với NumPy",
        "Thao tác thống kê",
        "Tối ưu hóa hiệu suất",
        "Tích hợp với các thư viện khác"
      ]
    },
    {
      section: "Chương 4: Trực quan hóa dữ liệu",
      lessons: [
        "Matplotlib cơ bản và tùy chỉnh",
        "Seaborn cho biểu đồ thống kê",
        "Plotly cho biểu đồ tương tác",
        "Tạo dashboard với Streamlit",
        "Kỹ thuật vẽ biểu đồ nâng cao",
        "Kể chuyện bằng trực quan hóa dữ liệu"
      ]
    },
    {
      section: "Chương 5: Machine Learning",
      lessons: [
        "Machine Learning cơ bản và quy trình",
        "Học có giám sát: regression và classification",
        "Đánh giá và xác thực mô hình",
        "Lựa chọn đặc trưng và giảm chiều",
        "Phương pháp ensemble và thuật toán nâng cao",
        "Tinh chỉnh tham số và tối ưu mô hình"
      ]
    },
    {
      section: "Chương 6: Chủ đề nâng cao và dự án",
      lessons: [
        "Xử lý ngôn ngữ tự nhiên cơ bản",
        "Computer Vision với OpenCV",
        "Web scraping để thu thập dữ liệu",
        "Tích hợp API và data pipelines",
        "Triển khai mô hình với Flask/FastAPI",
        "Dự án cuối: Giải pháp ML hoàn chỉnh"
      ]
    }
  ],

  "Lập trình JavaScript từ cơ bản đến nâng cao": [
    {
      section: "Chương 1: JavaScript cơ bản",
      lessons: [
        "Giới thiệu JavaScript và môi trường phát triển",
        "Biến, kiểu dữ liệu và toán tử",
        "Cấu trúc điều khiển: if/else, switch",
        "Vòng lặp: for, while, do-while",
        "Hàm và phạm vi biến (scope)",
        "Mảng và đối tượng cơ bản"
      ]
    },
    {
      section: "Chương 2: JavaScript hiện đại (ES6+)",
      lessons: [
        "Tính năng ES6+: let, const, arrow functions",
        "Destructuring và Template literals",
        "Spread operator và Rest parameters",
        "Classes và kế thừa",
        "Modules và import/export",
        "Closures và lexical scope"
      ]
    },
    {
      section: "Chương 3: Thao tác DOM",
      lessons: [
        "Hiểu về DOM và BOM",
        "Chọn và thay đổi elements",
        "Xử lý sự kiện và event delegation",
        "Tạo nội dung động",
        "Xử lý form và validation",
        "Local Storage và Session Storage"
      ]
    },
    {
      section: "Chương 4: Lập trình bất đồng bộ",
      lessons: [
        "Callback functions và callback hell",
        "Promises và promise chaining",
        "Mô hình Async/Await",
        "Fetch API và AJAX",
        "Xử lý lỗi trong code bất đồng bộ",
        "Làm việc với APIs"
      ]
    },
    {
      section: "Chương 5: Dự án thực hành",
      lessons: [
        "Ứng dụng Todo List",
        "Ứng dụng thời tiết với API",
        "Game Quiz tương tác",
        "Giỏ hàng với Local Storage",
        "Ứng dụng tìm kiếm phim",
        "Dự án cuối: Mini Social Media Dashboard"
      ]
    }
  ],

  "Python cơ bản cho trẻ em": [
    {
      section: "Chương 1: Khám phá Python",
      lessons: [
        "Python là gì? Tại sao Python thú vị cho trẻ em?",
        "Cài đặt Python và IDLE theo cách đơn giản",
        "Viết chương trình 'Xin chào' đầu tiên",
        "Tạo và chạy file Python đầu tiên",
        "Khám phá Python Shell tương tác",
        "Thực hành viết code cơ bản"
      ]
    },
    {
      section: "Chương 2: Biến và kiểu dữ liệu",
      lessons: [
        "Biến là gì? Cách đặt tên biến thú vị",
        "Số nguyên và số thập phân trong Python",
        "Chuỗi văn bản và thao tác cơ bản",
        "Boolean: True/False trong lập trình",
        "Danh sách (Lists) để lưu trữ nhiều thứ",
        "Dự án: Tạo danh sách đồ chơi yêu thích"
      ]
    },
    {
      section: "Chương 3: Tính toán và logic",
      lessons: [
        "Phép tính cơ bản: +, -, *, /",
        "So sánh: lớn hơn, nhỏ hơn, bằng nhau",
        "Câu lệnh if: đưa ra quyết định",
        "If-else: lựa chọn này hoặc lựa chọn kia",
        "Vòng lặp for: lặp lại công việc",
        "Dự án: Máy tính đơn giản cho trẻ em"
      ]
    },
    {
      section: "Chương 4: Turtle Graphics - Vẽ với Python",
      lessons: [
        "Giới thiệu Turtle Graphics",
        "Di chuyển con rùa: forward, backward, left, right",
        "Vẽ hình vuông và tam giác",
        "Thay đổi màu sắc và kích thước bút vẽ",
        "Vẽ hình tròn và hình sao",
        "Dự án: Vẽ ngôi nhà mơ ước"
      ]
    },
    {
      section: "Chương 5: Game và ứng dụng đơn giản",
      lessons: [
        "Tạo game đoán số",
        "Game 'Kéo búa bao' với máy tính",
        "Ứng dụng tính tuổi",
        "Máy tạo mật khẩu đơn giản",
        "Quiz game với điểm số",
        "Dự án: Adventure text game"
      ]
    },
    {
      section: "Chương 6: Dự án sáng tạo cuối khóa",
      lessons: [
        "Lên kế hoạch cho dự án cá nhân",
        "Kết hợp Turtle Graphics với game logic",
        "Tạo ứng dụng quản lý thông tin cá nhân",
        "Debug và sửa lỗi như một programmer thật",
        "Hoàn thiện và trình bày dự án",
        "Lên kế hoạch học tiếp Python nâng cao"
      ]
    }
  ]
};

const updateCurriculumToVietnamese = async () => {
  try {
    console.log('🔄 Đang cập nhật curriculum sang tiếng Việt...');
    
    const courses = await Course.find({});
    console.log(`📚 Tìm thấy ${courses.length} khóa học`);
    
    for (const course of courses) {
      const vietnameseCurriculum = vietnameseCurriculums[course.title];
      
      if (vietnameseCurriculum) {
        await Course.findByIdAndUpdate(course._id, {
          curriculum: vietnameseCurriculum
        });
        console.log(`✅ Đã cập nhật curriculum cho: ${course.title}`);
      } else {
        console.log(`⚠️ Chưa có curriculum tiếng Việt cho: ${course.title}`);
      }
    }
    
    console.log('🎉 Hoàn thành cập nhật curriculum!');
    
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật curriculum:', error);
  }
};

const main = async () => {
  await connectDB();
  await updateCurriculumToVietnamese();
  process.exit(0);
};

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
