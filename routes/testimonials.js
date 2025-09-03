const express = require('express');
const router = express.Router();

// Temporary testimonials data (would normally come from database)
const testimonials = [
  {
    id: 1,
    name: "Nguyễn Minh Tuấn",
    position: "Học sinh lớp 6",
    company: "Trường THCS Nguyễn Trãi",
    content: "Em rất thích học Scratch! Trước em không biết gì về lập trình, nhưng giờ em đã tự tạo được game maze và truyện tương tác. Cô giáo dạy rất vui, luôn khuyến khích em sáng tạo những ý tưởng mới.",
    rating: 5,
    course: "Lập trình Scratch cơ bản cho trẻ em",
    image: "/testimonials/student1.jpg"
  },
  {
    id: 2,
    name: "Trần Bảo Ngọc",
    position: "Học sinh lớp 8",
    company: "Trường THCS Lê Quý Đôn",
    content: "Khóa Python cơ bản thật tuyệt! Em đã học được cách vẽ hình với Turtle và làm được game đoán số. Ba mẹ em rất vui khi thấy em có thể tự viết chương trình. Giờ em muốn học thêm Python nâng cao!",
    rating: 5,
    course: "Lập trình Python cơ bản cho trẻ em",
    image: "/testimonials/student2.jpg"
  },
  {
    id: 3,
    name: "Lê Minh Khải",
    position: "Sinh viên năm 2",
    company: "Đại học Công nghệ thông tin",
    content: "Mình đã thử tự học HTML CSS qua YouTube nhưng không hiệu quả. Khóa học 1:1 giúp mình nắm vững từ cơ bản đến responsive design. Giảng viên phát hiện và sửa lỗi ngay lập tức, tiến bộ nhanh hơn rất nhiều!",
    rating: 5,
    course: "HTML & CSS từ cơ bản đến responsive",
    image: "/testimonials/student3.jpg"
  },
  {
    id: 4,
    name: "Phạm Thị Hương",
    position: "Marketing Executive",
    company: "Công ty TNHH ABC",
    content: "Trước đây mình chỉ biết copy code JavaScript mà không hiểu. Sau 2 tháng học 1:1, mình đã tự tin viết được những function phức tạp, xử lý API và tạo tương tác cho website công ty. Thầy giáo rất kiên nhẫn!",
    rating: 5,
    course: "Lập trình JavaScript từ cơ bản đến nâng cao",
    image: "/testimonials/student4.jpg"
  },
  {
    id: 5,
    name: "Nguyễn Đức Anh",
    position: "Fresher Developer",
    company: "Startup Technology",
    content: "Node.js là bước ngoặt trong sự nghiệp của mình. Từ một frontend developer đơn thuần, giờ mình có thể xây dựng API, quản lý database, deploy server. Dự án cuối khóa đã giúp mình ấn tượng với nhà tuyển dụng.",
    rating: 5,
    course: "Node.js & Express Backend Development",
    image: "/testimonials/student5.jpg"
  },
  {
    id: 6,
    name: "Võ Thị Mai Linh",
    position: "Junior Frontend Developer",
    company: "Digital Agency XYZ",
    content: "React thay đổi hoàn toàn cách mình nghĩ về frontend development. Từ việc quản lý state đến xây dựng component có thể tái sử dụng, tất cả đều rõ ràng sau khóa học. Team lead khen mình viết code clean và dễ maintain!",
    rating: 5,
    course: "Khóa học React từ cơ bản đến nâng cao",
    image: "/testimonials/student6.jpg"
  },
  {
    id: 7,
    name: "Bùi Văn Thành",
    position: "Web Developer",
    company: "Freelancer",
    content: "Sau khi học xong HTML, CSS, JavaScript và React, mình đã tự tin nhận những dự án freelance lớn. Thu nhập tháng đầu tiên đã gấp 2 lần lương cũ. Cách dạy 1:1 giúp mình học đúng trọng tâm, không lãng phí thời gian.",
    rating: 5,
    course: "Lộ trình Fullstack Developer",
    image: "/testimonials/student7.jpg"
  },
  {
    id: 8,
    name: "Trần Thị Thu Hà",
    position: "Chủ shop online",
    company: "Shop thời trang Hà Anh",
    content: "Mình chỉ cần học HTML CSS để tự customize website bán hàng. Thầy đã hướng dẫn rất chi tiết, từ layout đến responsive trên mobile. Giờ website của mình trông chuyên nghiệp hơn hẳn, khách hàng tin tưởng mua hàng hơn!",
    rating: 5,
    course: "HTML & CSS thực chiến cho doanh nghiệp",
    image: "/testimonials/student8.jpg"
  }
];

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const testimonial = testimonials.find(t => t.id === parseInt(req.params.id));

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
