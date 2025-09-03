# TechBoost Backend API

Backend API cho TechBoost Learning Platform được xây dựng với Node.js, Express và MongoDB.

## 🚀 Tính năng

- **RESTful API** cho courses, instructors, reviews, testimonials
- **MongoDB Database** với Mongoose ODM
- **Validation** với express-validator
- **Security** với helmet, cors, rate limiting
- **Error Handling** middleware
- **Database Seeding** script

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 5.0
- NPM hoặc Yarn

## ⚙️ Cài đặt

1. **Clone repository và di chuyển vào thư mục backend:**
```bash
cd techboost-backend
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env và cấu hình:**
```bash
cp .env.example .env
```

4. **Cấu hình MongoDB trong .env:**
```env
MONGODB_URI=mongodb://localhost:27017/techboost
PORT=5000
JWT_SECRET=your-secret-key
```

5. **Khởi chạy MongoDB** (nếu chạy local):
```bash
mongod
```

6. **Seed database với dữ liệu mẫu:**
```bash
npm run seed
```

7. **Khởi chạy server:**
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Courses
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới (Admin)
- `PUT /api/courses/:id` - Cập nhật khóa học (Admin)
- `DELETE /api/courses/:id` - Xóa khóa học (Admin)
- `GET /api/courses/:id/reviews` - Lấy đánh giá của khóa học

### Instructors
- `GET /api/instructors` - Lấy danh sách giảng viên
- `GET /api/instructors/:id` - Lấy chi tiết giảng viên
- `POST /api/instructors` - Tạo giảng viên mới (Admin)
- `PUT /api/instructors/:id` - Cập nhật giảng viên (Admin)
- `DELETE /api/instructors/:id` - Xóa giảng viên (Admin)

### Reviews
- `GET /api/reviews` - Lấy danh sách đánh giá
- `POST /api/reviews` - Tạo đánh giá mới
- `PUT /api/reviews/:id` - Cập nhật đánh giá
- `DELETE /api/reviews/:id` - Xóa đánh giá

### Testimonials
- `GET /api/testimonials` - Lấy danh sách testimonials
- `GET /api/testimonials/:id` - Lấy chi tiết testimonial

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `GET /api/categories/:name/courses` - Lấy khóa học theo danh mục

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất

## 🔍 Query Parameters

### Courses API
```bash
# Phân trang
GET /api/courses?page=1&limit=10

# Lọc theo danh mục
GET /api/courses?category=Frontend

# Lọc theo level
GET /api/courses?level=Cơ bản

# Lọc khóa học nổi bật
GET /api/courses?featured=true

# Tìm kiếm
GET /api/courses?search=React

# Sắp xếp
GET /api/courses?sort=-rating    # Giảm dần theo rating
GET /api/courses?sort=price      # Tăng dần theo giá
```

### Instructors API
```bash
# Phân trang
GET /api/instructors?page=1&limit=12

# Tìm kiếm
GET /api/instructors?search=Frontend

# Sắp xếp
GET /api/instructors?sort=-rating
```

## 🗄️ Database Models

### Course Model
- title, description, instructor
- price, originalPrice, duration
- rating, studentsCount, lessons
- level, category, skills
- curriculum, learningOutcomes
- prerequisites, targetAudience

### Instructor Model
- name, bio, avatar
- rating, coursesCount, studentsCount
- expertise, skills, experience
- contact info, social media

### Review Model
- courseId, studentName, rating
- comment, timestamp
- approval status

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Data sanitization
- **Error Handling** - Secure error responses

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techboost
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key
```

### PM2 (Production)
```bash
npm install -g pm2
pm2 start server.js --name "techboost-api"
pm2 startup
pm2 save
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Request logging trong development
- Error tracking middleware
- Performance monitoring

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **TechBoost Development Team**
- Backend API: Node.js + Express + MongoDB
- Frontend: Next.js 15 + TypeScript

---

🔗 **Links:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health
