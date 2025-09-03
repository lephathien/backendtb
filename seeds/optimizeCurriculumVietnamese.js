const mongoose = require('mongoose');
require('dotenv').config();

const Course = require('../models/Course');

// Từ điển chuyển đổi thuật ngữ
const termTranslations = {
  // Giữ nguyên các thuật ngữ chuyên ngành
  'React': 'React',
  'JavaScript': 'JavaScript',
  'HTML': 'HTML',
  'CSS': 'CSS',
  'Node.js': 'Node.js',
  'Express': 'Express',
  'MongoDB': 'MongoDB',
  'Python': 'Python',
  'Figma': 'Figma',
  'Flutter': 'Flutter',
  'Dart': 'Dart',
  'UI/UX': 'UI/UX',
  'API': 'API',
  'REST': 'REST',
  'GraphQL': 'GraphQL',
  'SQL': 'SQL',
  'NoSQL': 'NoSQL',
  'AWS': 'AWS',
  'Docker': 'Docker',
  'Git': 'Git',
  'GitHub': 'GitHub',
  'JWT': 'JWT',
  'OAuth': 'OAuth',
  'TypeScript': 'TypeScript',
  'Vue.js': 'Vue.js',
  'Angular': 'Angular',
  'Bootstrap': 'Bootstrap',
  'jQuery': 'jQuery',
  'Webpack': 'Webpack',
  'Babel': 'Babel',
  'npm': 'npm',
  'yarn': 'yarn',
  'JSON': 'JSON',
  'XML': 'XML',
  'AJAX': 'AJAX',
  'DevOps': 'DevOps',
  'CI/CD': 'CI/CD',
  'Machine Learning': 'Machine Learning',
  'Data Science': 'Data Science',
  'Pandas': 'Pandas',
  'NumPy': 'NumPy',
  'TensorFlow': 'TensorFlow',
  'Keras': 'Keras',
  'Matplotlib': 'Matplotlib',
  'Jupyter': 'Jupyter',
  'Anaconda': 'Anaconda',
  
  // Chuyển đổi các từ tiếng Anh thông thường
  'Fundamentals': 'Cơ bản',
  'fundamentals': 'cơ bản',
  'Introduction': 'Giới thiệu',
  'introduction': 'giới thiệu',
  'Basic': 'Cơ bản',
  'basic': 'cơ bản',
  'Advanced': 'Nâng cao',
  'advanced': 'nâng cao',
  'Framework': 'Framework',
  'framework': 'framework',
  'Development': 'Phát triển',
  'development': 'phát triển',
  'Design': 'Thiết kế',
  'design': 'thiết kế',
  'Setup': 'Thiết lập',
  'setup': 'thiết lập',
  'Overview': 'Tổng quan',
  'overview': 'tổng quan',
  'Installation': 'Cài đặt',
  'installation': 'cài đặt',
  'Configuration': 'Cấu hình',
  'configuration': 'cấu hình',
  'Implementation': 'Triển khai',
  'implementation': 'triển khai',
  'Testing': 'Kiểm thử',
  'testing': 'kiểm thử',
  'Deployment': 'Triển khai',
  'deployment': 'triển khai',
  'Optimization': 'Tối ưu hóa',
  'optimization': 'tối ưu hóa',
  'Performance': 'Hiệu suất',
  'performance': 'hiệu suất',
  'Security': 'Bảo mật',
  'security': 'bảo mật',
  'Authentication': 'Xác thực',
  'authentication': 'xác thực',
  'Authorization': 'Phân quyền',
  'authorization': 'phân quyền',
  'Validation': 'Xác thực',
  'validation': 'xác thực',
  'Error': 'Lỗi',
  'error': 'lỗi',
  'Handling': 'Xử lý',
  'handling': 'xử lý',
  'Management': 'Quản lý',
  'management': 'quản lý',
  'Integration': 'Tích hợp',
  'integration': 'tích hợp',
  'Project': 'Dự án',
  'project': 'dự án',
  'Best': 'Tốt nhất',
  'best': 'tốt nhất',
  'Practices': 'Thực hành',
  'practices': 'thực hành',
  'Tips': 'Mẹo',
  'tips': 'mẹo',
  'Tricks': 'Thủ thuật',
  'tricks': 'thủ thuật',
  'Tools': 'Công cụ',
  'tools': 'công cụ',
  'Environment': 'Môi trường',
  'environment': 'môi trường',
  'Variables': 'Biến',
  'variables': 'biến',
  'Functions': 'Hàm',
  'functions': 'hàm',
  'Methods': 'Phương thức',
  'methods': 'phương thức',
  'Properties': 'Thuộc tính',
  'properties': 'thuộc tính',
  'Objects': 'Đối tượng',
  'objects': 'đối tượng',
  'Arrays': 'Mảng',
  'arrays': 'mảng',
  'Loops': 'Vòng lặp',
  'loops': 'vòng lặp',
  'Conditions': 'Điều kiện',
  'conditions': 'điều kiện',
  'Operators': 'Toán tử',
  'operators': 'toán tử',
  'Syntax': 'Cú pháp',
  'syntax': 'cú pháp',
  'Components': 'Component',
  'components': 'component',
  'Props': 'Props',
  'props': 'props',
  'State': 'State',
  'state': 'state',
  'Hooks': 'Hook',
  'hooks': 'hook',
  'Routing': 'Định tuyến',
  'routing': 'định tuyến',
  'Navigation': 'Điều hướng',
  'navigation': 'điều hướng',
  'Database': 'Cơ sở dữ liệu',
  'database': 'cơ sở dữ liệu',
  'Schema': 'Schema',
  'schema': 'schema',
  'Model': 'Model',
  'model': 'model',
  'Controller': 'Controller',
  'controller': 'controller',
  'Router': 'Router',
  'router': 'router',
  'Middleware': 'Middleware',
  'middleware': 'middleware',
  'Server': 'Server',
  'server': 'server',
  'Client': 'Client',
  'client': 'client',
  'Response': 'Phản hồi',
  'response': 'phản hồi',
  'Request': 'Yêu cầu',
  'request': 'yêu cầu',
  'Data': 'Dữ liệu',
  'data': 'dữ liệu',
  'Types': 'Kiểu',
  'types': 'kiểu',
  'Interface': 'Giao diện',
  'interface': 'giao diện',
  'Class': 'Lớp',
  'class': 'lớp',
  'Package': 'Gói',
  'package': 'gói',
  'Module': 'Module',
  'module': 'module',
  'Library': 'Thư viện',
  'library': 'thư viện',
  'Dependencies': 'Phụ thuộc',
  'dependencies': 'phụ thuộc',
  'Build': 'Xây dựng',
  'build': 'xây dựng',
  'Run': 'Chạy',
  'run': 'chạy',
  'Debug': 'Gỡ lỗi',
  'debug': 'gỡ lỗi',
  'File': 'Tệp',
  'file': 'tệp',
  'Folder': 'Thư mục',
  'folder': 'thư mục',
  'Path': 'Đường dẫn',
  'path': 'đường dẫn',
  'URL': 'URL',
  'url': 'url',
  'Link': 'Liên kết',
  'link': 'liên kết',
  'Button': 'Nút',
  'button': 'nút',
  'Form': 'Biểu mẫu',
  'form': 'biểu mẫu',
  'Input': 'Đầu vào',
  'input': 'đầu vào',
  'Output': 'Đầu ra',
  'output': 'đầu ra',
  'Event': 'Sự kiện',
  'event': 'sự kiện',
  'Callback': 'Callback',
  'callback': 'callback',
  'Promise': 'Promise',
  'promise': 'promise',
  'Async': 'Bất đồng bộ',
  'async': 'bất đồng bộ',
  'Await': 'Await',
  'await': 'await',
  'Fetch': 'Fetch',
  'fetch': 'fetch',
  'Loading': 'Tải',
  'loading': 'tải',
  'Cache': 'Bộ nhớ đệm',
  'cache': 'bộ nhớ đệm',
  'Session': 'Phiên',
  'session': 'phiên',
  'Cookie': 'Cookie',
  'cookie': 'cookie',
  'Token': 'Token',
  'token': 'token',
  'Hash': 'Hash',
  'hash': 'hash',
  'Encryption': 'Mã hóa',
  'encryption': 'mã hóa',
  'Version': 'Phiên bản',
  'version': 'phiên bản',
  'Update': 'Cập nhật',
  'update': 'cập nhật',
  'Upgrade': 'Nâng cấp',
  'upgrade': 'nâng cấp',
  'Migration': 'Migration',
  'migration': 'migration',
  'Backup': 'Sao lưu',
  'backup': 'sao lưu',
  'Restore': 'Khôi phục',
  'restore': 'khôi phục',
  'Monitor': 'Giám sát',
  'monitor': 'giám sát',
  'Log': 'Nhật ký',
  'log': 'nhật ký',
  'Debug': 'Gỡ lỗi',
  'debug': 'gỡ lỗi',
  'Review': 'Đánh giá',
  'review': 'đánh giá',
  'Refactor': 'Tái cấu trúc',
  'refactor': 'tái cấu trúc',
  'Clean': 'Làm sạch',
  'clean': 'làm sạch',
  'Code': 'Mã',
  'code': 'mã',
  'Style': 'Kiểu',
  'style': 'kiểu',
  'Convention': 'Quy ước',
  'convention': 'quy ước',
  'Standard': 'Tiêu chuẩn',
  'standard': 'tiêu chuẩn',
  'Guidelines': 'Hướng dẫn',
  'guidelines': 'hướng dẫn',
  'Documentation': 'Tài liệu',
  'documentation': 'tài liệu',
  'Tutorial': 'Hướng dẫn',
  'tutorial': 'hướng dẫn',
  'Example': 'Ví dụ',
  'example': 'ví dụ',
  'Demo': 'Demo',
  'demo': 'demo',
  'Sample': 'Mẫu',
  'sample': 'mẫu',
  'Template': 'Mẫu',
  'template': 'mẫu',
  'Boilerplate': 'Boilerplate',
  'boilerplate': 'boilerplate'
};

function translateText(text) {
  if (!text) return text;
  
  let translatedText = text;
  
  // Thay thế các từ/cụm từ
  for (const [english, vietnamese] of Object.entries(termTranslations)) {
    // Thay thế từ đầu câu
    const startRegex = new RegExp(`^${english}\\b`, 'g');
    translatedText = translatedText.replace(startRegex, vietnamese);
    
    // Thay thế từ cuối câu
    const endRegex = new RegExp(`\\b${english}$`, 'g');
    translatedText = translatedText.replace(endRegex, vietnamese);
    
    // Thay thế từ giữa câu (có khoảng trắng xung quanh)
    const middleRegex = new RegExp(`\\s${english}\\s`, 'g');
    translatedText = translatedText.replace(middleRegex, ` ${vietnamese} `);
    
    // Thay thế từ sau dấu hai chấm
    const colonRegex = new RegExp(`: ${english}\\b`, 'g');
    translatedText = translatedText.replace(colonRegex, `: ${vietnamese}`);
    
    // Thay thế từ sau "và"
    const andRegex = new RegExp(`và ${english}\\b`, 'g');
    translatedText = translatedText.replace(andRegex, `và ${vietnamese}`);
  }
  
  return translatedText;
}

// Curriculum cải thiện cho từng khóa học
const improvedCurriculums = {
  'Khóa học React từ cơ bản đến nâng cao': [
    {
      section: 'Module 1: Giới thiệu về React',
      lessons: [
        'Tại sao chọn React? So sánh với các framework khác',
        'Cài đặt môi trường phát triển với Create React App',
        'Hiểu về JSX và Virtual DOM',
        'Component cơ bản và Props',
        'Cơ chế render và re-render',
        'Xử lý sự kiện trong React'
      ]
    },
    {
      section: 'Module 2: React Component',
      lessons: [
        'Function Component so với Class Component',
        'State và useState Hook',
        'Lifecycle methods và useEffect',
        'Conditional rendering',
        'Danh sách và keys',
        'Forms và controlled components'
      ]
    },
    {
      section: 'Module 3: React Hook nâng cao',
      lessons: [
        'useState và useEffect chi tiết',
        'useContext để quản lý state',
        'useReducer cho state phức tạp',
        'useMemo và useCallback tối ưu hiệu suất',
        'Custom hooks',
        'Hook rules và best practices'
      ]
    },
    {
      section: 'Module 4: Quản lý state và data',
      lessons: [
        'Local state vs Global state',
        'Context API cho state sharing',
        'Redux cơ bản',
        'Redux Toolkit hiện đại',
        'Async actions với Redux Thunk',
        'State normalization'
      ]
    },
    {
      section: 'Module 5: Routing và Navigation',
      lessons: [
        'React Router cơ bản',
        'Dynamic routing và parameters',
        'Nested routes',
        'Programmatic navigation',
        'Route guards và protected routes',
        'Code splitting với lazy loading'
      ]
    },
    {
      section: 'Module 6: Tối ưu hóa và Best Practices',
      lessons: [
        'React.memo và performance optimization',
        'Bundle splitting và lazy loading',
        'Error boundaries',
        'Testing với Jest và React Testing Library',
        'Accessibility (a11y) trong React',
        'Production deployment'
      ]
    }
  ],

  'Node.js & Express Backend Development': [
    {
      section: 'Module 1: Node.js cơ bản',
      lessons: [
        'Giới thiệu Node.js và kiến trúc Event-driven',
        'NPM và quản lý package',
        'Module system: CommonJS vs ES6',
        'File system operations',
        'Path và URL handling',
        'Environment variables'
      ]
    },
    {
      section: 'Module 2: Express Framework',
      lessons: [
        'Cài đặt và cấu hình Express',
        'Routing và route parameters',
        'Middleware và request pipeline',
        'Request và response objects',
        'Template engines',
        'Static files serving'
      ]
    },
    {
      section: 'Module 3: Tích hợp cơ sở dữ liệu',
      lessons: [
        'MongoDB cơ bản và MongoDB Atlas',
        'Mongoose ODM và Schema design',
        'CRUD operations',
        'Data validation và sanitization',
        'Relationships và population',
        'Aggregation pipeline'
      ]
    },
    {
      section: 'Module 4: Authentication và Authorization',
      lessons: [
        'Session-based authentication',
        'JWT tokens',
        'Password hashing với bcrypt',
        'OAuth 2.0 integration',
        'Role-based access control',
        'Security best practices'
      ]
    },
    {
      section: 'Module 5: API Development',
      lessons: [
        'RESTful API design principles',
        'HTTP status codes và error handling',
        'API documentation với Swagger',
        'Rate limiting và throttling',
        'CORS configuration',
        'API versioning'
      ]
    },
    {
      section: 'Module 6: Testing và Deployment',
      lessons: [
        'Unit testing với Jest',
        'Integration testing',
        'API testing với Supertest',
        'Environment configuration',
        'Docker containerization',
        'Deployment lên cloud platforms'
      ]
    }
  ],

  'Python cho Data Science & Machine Learning': [
    {
      section: 'Module 1: Python cho Data Science cơ bản',
      lessons: [
        'Thiết lập môi trường: Anaconda, Jupyter Notebook',
        'Ôn tập Python cơ bản: kiểu dữ liệu, vòng lặp, hàm',
        'Working với files và directories',
        'Virtual environments',
        'Package management với pip và conda',
        'Git cho data science projects'
      ]
    },
    {
      section: 'Module 2: Thao tác dữ liệu với Pandas',
      lessons: [
        'Pandas cơ bản: Series và DataFrame',
        'Tải dữ liệu: CSV, JSON, Excel, SQL databases',
        'Data cleaning và preprocessing',
        'Filtering, sorting và grouping',
        'Merging và joining datasets',
        'Time series data handling'
      ]
    },
    {
      section: 'Module 3: Tính toán khoa học với NumPy',
      lessons: [
        'NumPy arrays và operations',
        'Broadcasting và vectorization',
        'Mathematical functions',
        'Linear algebra operations',
        'Random number generation',
        'Performance optimization'
      ]
    },
    {
      section: 'Module 4: Trực quan hóa dữ liệu',
      lessons: [
        'Matplotlib cơ bản',
        'Seaborn cho statistical plots',
        'Interactive visualizations với Plotly',
        'Customizing plots và styling',
        'Dashboard creation',
        'Best practices cho data visualization'
      ]
    },
    {
      section: 'Module 5: Machine Learning cơ bản',
      lessons: [
        'Giới thiệu Machine Learning',
        'Scikit-learn library',
        'Supervised learning: regression và classification',
        'Unsupervised learning: clustering',
        'Model evaluation và metrics',
        'Cross-validation và hyperparameter tuning'
      ]
    },
    {
      section: 'Module 6: Dự án thực tế',
      lessons: [
        'End-to-end data science project',
        'Exploratory data analysis (EDA)',
        'Feature engineering',
        'Model selection và optimization',
        'Results interpretation',
        'Deployment và productionization'
      ]
    }
  ]
};

async function optimizeCurriculums() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techboost');
    console.log('Connected to MongoDB');

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    let updatedCount = 0;

    for (const course of courses) {
      let needsUpdate = false;
      let newCurriculum = [];

      // Kiểm tra xem có curriculum cải thiện sẵn không
      if (improvedCurriculums[course.title]) {
        newCurriculum = improvedCurriculums[course.title];
        needsUpdate = true;
        console.log(`Using improved curriculum for: ${course.title}`);
      } else if (course.curriculum) {
        // Dịch curriculum hiện có
        newCurriculum = course.curriculum.map(module => ({
          section: translateText(module.section),
          lessons: module.lessons.map(lesson => translateText(lesson))
        }));
        
        // Kiểm tra xem có thay đổi gì không
        const originalText = JSON.stringify(course.curriculum);
        const newText = JSON.stringify(newCurriculum);
        if (originalText !== newText) {
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await Course.findByIdAndUpdate(course._id, {
          curriculum: newCurriculum
        });
        
        updatedCount++;
        console.log(`✅ Updated curriculum for: ${course.title}`);
      } else {
        console.log(`⏭️  No changes needed for: ${course.title}`);
      }
    }

    console.log(`\n🎉 Optimization completed! Updated ${updatedCount} courses.`);
    
  } catch (error) {
    console.error('Error optimizing curriculums:', error);
  } finally {
    mongoose.connection.close();
  }
}

optimizeCurriculums();
