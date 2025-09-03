# 📁 TechBoost Backend - Image Upload Guide

## 🗂️ Cấu trúc thư mục lưu trữ ảnh:

```
techboost-backend/
├── public/
│   └── uploads/
│       ├── courses/        # Ảnh khóa học
│       ├── instructors/    # Ảnh giảng viên  
│       └── testimonials/   # Ảnh testimonials
├── routes/
│   └── upload.js          # Route xử lý upload
└── server.js              # Cấu hình serve static files
```

## 🔧 Cấu hình:

### `.env` file:
```env
FILE_UPLOAD_PATH=./public/uploads
```

### Server configuration:
- **Static files:** Phục vụ tại `/uploads/*`
- **Max file size:** 5MB
- **Allowed types:** Image files only (jpg, png, gif, webp, etc.)

## 🚀 API Endpoints:

### 1. Upload ảnh:
```http
POST /api/upload/:type
Content-Type: multipart/form-data

Body: 
- image: [file] (required)

Types: courses | instructors | testimonials
```

**Example:**
```bash
curl -X POST \
  http://localhost:5000/api/upload/courses \
  -F "image=@course-image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "image-1640995200000-123456789.jpg",
    "originalName": "course-image.jpg",
    "mimetype": "image/jpeg",
    "size": 245760,
    "url": "/uploads/courses/image-1640995200000-123456789.jpg",
    "fullUrl": "http://localhost:5000/uploads/courses/image-1640995200000-123456789.jpg"
  }
}
```

### 2. Xóa ảnh:
```http
DELETE /api/upload/:type/:filename
```

**Example:**
```bash
curl -X DELETE \
  http://localhost:5000/api/upload/courses/image-1640995200000-123456789.jpg
```

### 3. Liệt kê ảnh:
```http
GET /api/upload/:type
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "filename": "image-1640995200000-123456789.jpg",
      "url": "/uploads/courses/image-1640995200000-123456789.jpg",
      "fullUrl": "http://localhost:5000/uploads/courses/image-1640995200000-123456789.jpg",
      "size": 245760,
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🔗 Truy cập ảnh:

### Relative URL (trong ứng dụng):
```
/uploads/courses/image-filename.jpg
/uploads/instructors/avatar.png
/uploads/testimonials/user-photo.webp
```

### Full URL:
```
http://localhost:5000/uploads/courses/image-filename.jpg
http://localhost:5000/uploads/instructors/avatar.png
http://localhost:5000/uploads/testimonials/user-photo.webp
```

## 💡 Sử dụng trong models:

### Course Model:
```javascript
const courseSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: '/uploads/courses/default-course.jpg'
  }
  // ...other fields
});
```

### Instructor Model:
```javascript
const instructorSchema = new mongoose.Schema({
  name: String,
  avatar: {
    type: String,
    default: '/uploads/instructors/default-avatar.png'
  }
  // ...other fields
});
```

## 🔒 Security Notes:

1. **File validation:** Chỉ chấp nhận file ảnh
2. **Size limit:** Tối đa 5MB per file
3. **Filename security:** Tự động generate unique filename
4. **Production:** Nên thêm authentication cho upload endpoints

## 🎯 Frontend Integration:

### React/Next.js Example:
```javascript
const uploadImage = async (file, type) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(`/api/upload/${type}`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.data.url; // Use this URL in your models
};
```
