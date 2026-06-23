const mongoose = require('mongoose');
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

// High-quality review templates (4.5-5 stars) - mỗi name gắn với một comment duy nhất
const reviewTemplates = [
  {
    name: 'Nguyễn Thị Thúy Hằng',
    comment: 'Nhờ khóa học, mình nắm vững kiến thức từ A đến Z, có khả năng xây dựng ứng dụng hoàn chỉnh và tự tin ứng tuyển vào công ty với mức lương cao. Khóa học giúp mình phát triển tư duy logic, sáng tạo và khả năng giải quyết vấn đề hiệu quả. Giảng viên nhiệt tình, tận tâm, luôn sẵn sàng giải đáp thắc mắc và hướng dẫn học viên nên mình tiếp thu kiến thức rất nhanh.',
    rating: 5
  },
  {
    name: 'Nguyễn Thị Thu Hà',
    comment: 'Khóa học đã thay đổi hoàn toàn cách nhìn của mình về công nghệ. Giảng viên có cách truyền đạt rất hay, biết cách làm cho những kiến thức phức tạp trở nên đơn giản và dễ hiểu. Mình đã có thể ứng dụng ngay vào công việc và được đánh giá cao.',
    rating: 5
  },
  {
    name: 'Nguyễn Thị Minh Châu',
    comment: 'Sau khi hoàn thành khóa học, mình đã thay đổi hoàn toàn sự nghiệp và theo đuổi đam mê công nghệ. Nội dung khóa học được thiết kế bài bản, từ cơ bản đến nâng cao một cách logic. Đặc biệt là phần thực hành với dự án thực tế giúp mình có portfolio ấn tượng.',
    rating: 4.5
  },
  {
    name: 'Trần Minh Long',
    comment: 'Khóa học giúp mình củng cố kiến thức nền tảng và học thêm nhiều kỹ năng mới. Nhờ vậy, mình tự tin tham gia các dự án thực tế và nhận được nhiều lời khen từ đồng nghiệp. Giảng viên có nhiều kinh nghiệm thực chiến, chia sẻ nhiều ví dụ dễ hiểu giúp mình vận dụng kiến thức vào thực tế một cách hiệu quả.',
    rating: 4.5
  },
  {
    name: 'Trần Văn Minh',
    comment: 'Tham gia khóa học này, mình đã trang bị kiến thức và kỹ năng cần thiết để khởi nghiệp trong lĩnh vực công nghệ. Khóa học còn giúp mình phát triển tư duy logic như một lập trình viên chuyên nghiệp. Sau khóa học, mình tự tin xây dựng dự án khởi nghiệp của riêng mình và đã đạt được những thành công nhất định.',
    rating: 5
  },
  {
    name: 'Trần Thị Bích Ngọc',
    comment: 'Chất lượng khóa học vượt xa mong đợi của mình. Giảng viên không chỉ truyền đạt kiến thức mà còn chia sẻ kinh nghiệm thực tế rất quý báu. Mình đã áp dụng được ngay những gì học vào công việc hiện tại và được sếp ghi nhận.',
    rating: 5
  },
  {
    name: 'Lê Thị Phương Linh',
    comment: 'Là người mới bắt đầu, mình được hướng dẫn bài bản, dễ hiểu, giúp mình nắm vững kiến thức nền tảng và có khả năng viết code cơ bản. Khóa học giúp mình thiết lập tư duy lập trình và phát triển khả năng suy luận. Sau khóa học, mình tự tin tham gia cộng đồng lập trình và học hỏi thêm nhiều kiến thức mới.',
    rating: 4.5
  },
  {
    name: 'Lê Văn Hoàng',
    comment: 'Mình rất hài lòng với khóa học này. Dù là người không có nền tảng kỹ thuật, nhưng cách giảng dạy rất dễ hiểu và có hệ thống. Sau mỗi bài học đều có bài tập để thực hành, giúp mình ghi nhớ kiến thức lâu dài. Giảng viên luôn nhiệt tình hỗ trợ khi mình gặp khó khăn.',
    rating: 5
  },
  {
    name: 'Lê Thị Mai Anh',
    comment: 'Khóa học đã mở ra cho mình một thế giới hoàn toàn mới. Từ một người hoàn toàn không biết gì về công nghệ, giờ mình đã có thể tự tạo ra những sản phẩm của riêng mình. Rất cảm ơn đội ngũ giảng viên đã tận tâm hướng dẫn.',
    rating: 4.5
  },
  {
    name: 'Phạm Thị Thanh Trúc',
    comment: 'Khóa học giúp mình trang bị kiến thức và kỹ năng cần thiết để theo đuổi ước mơ trở thành lập trình viên. Sau khóa học, mình tự tin tham gia vào các cuộc thi lập trình và đạt được nhiều giải thưởng cao. Giảng viên tâm huyết, luôn truyền cảm hứng cho học viên giúp mình có thêm động lực để học tập và theo đuổi đam mê.',
    rating: 5
  },
  {
    name: 'Phạm Văn Đức',
    comment: 'Đây là khoản đầu tư tốt nhất mình từng làm cho bản thân. Khóa học không chỉ dạy kiến thức mà còn định hướng con đường sự nghiệp rất rõ ràng. Mình đã chuyển nghề thành công và hiện tại đang làm việc tại một công ty công nghệ uy tín.',
    rating: 5
  },
  {
    name: 'Phạm Thị Lan Hương',
    comment: 'Nội dung khóa học rất thực tế và cập nhật. Mình học được không chỉ lý thuyết mà còn có cơ hội làm các dự án thực tế. Điều này giúp mình hiểu sâu hơn về cách ứng dụng kiến thức vào công việc. Giảng viên luôn sẵn sàng hỗ trợ 24/7.',
    rating: 4.5
  },
  {
    name: 'Nguyễn Văn Minh Đức',
    comment: 'Sau khóa học, tôi đã nâng cao khả năng xây dựng ứng dụng hiện đại, hiệu quả. Kết thúc khóa học, tôi đã tự tin nhận nhiều dự án lớn từ công ty và thu nhập cao hơn. Cảm ơn TechBoost đã giúp tôi phát triển bản thân và thành công trong sự nghiệp! Giảng viên am hiểu kiến thức chuyên môn, luôn cập nhật những xu hướng mới nhất.',
    rating: 5
  },
  {
    name: 'Vũ Minh Tuấn',
    comment: 'Khóa học vượt xa sự mong đợi của tôi. Từ một developer junior, giờ tôi đã được thăng chức lên senior developer nhờ những kiến thức và kỹ năng học được. Cách giảng dạy của thầy rất thực tế, luôn kết hợp với các case study từ dự án thực tế.',
    rating: 4.5
  },
  {
    name: 'Hoàng Văn Nam',
    comment: 'Tôi đã tham gia nhiều khóa học online khác nhưng chưa khóa nào ấn tượng như thế này. Giảng viên không chỉ dạy code mà còn hướng dẫn cách tư duy để giải quyết vấn đề. Điều này rất quan trọng trong công việc thực tế.',
    rating: 5
  },
  {
    name: 'Đặng Thị Hương',
    comment: 'Khóa học này thật sự thay đổi cuộc đời mình! Từ một người không biết gì về lập trình, giờ mình đã có thể làm freelancer và kiếm thu nhập ổn định. Giảng viên giảng dạy rất dễ hiểu, từng bước một cách chi tiết. Các bài tập thực hành giúp mình áp dụng ngay kiến thức vừa học.',
    rating: 5
  },
  {
    name: 'Bùi Văn Tài',
    comment: 'Đây là lần đầu tiên mình học lập trình và mình không nghĩ rằng mình có thể tiếp thu được nhiều đến vậy. Khóa học được thiết kế rất khoa học, từ dễ đến khó một cách hợp lý. Giảng viên luôn kiên trì hướng dẫn đến khi mình hiểu bài.',
    rating: 4.5
  },
  {
    name: 'Ngô Thị Lan',
    comment: 'Cảm ơn TechBoost đã mang đến cho mình một khóa học chất lượng cao như vậy. Không chỉ học được kiến thức chuyên môn, mình còn học được cách làm việc chuyên nghiệp và kỹ năng mềm cần thiết trong ngành IT.',
    rating: 5
  },
  {
    name: 'Cao Thị Minh',
    comment: 'Mình đã thử nhiều khóa học online khác nhưng chất lượng của TechBoost là tốt nhất. Giảng viên không chỉ có kiến thức sâu rộng mà còn có kinh nghiệm thực tế phong phú. Các bài giảng được chuẩn bị rất kỹ lưỡng và dễ theo dõi.',
    rating: 5
  },
  {
    name: 'Đinh Văn Hải',
    comment: 'Khóa học đã giúp mình chuyển đổi sự nghiệp thành công. Từ một ngành hoàn toàn khác, giờ mình đã trở thành developer và đang làm việc tại một startup. Điều quan trọng nhất là mình học được cách tự học và cập nhật kiến thức mới.',
    rating: 5
  },
  {
    name: 'Lý Thị Thu',
    comment: 'Rất ấn tượng với phương pháp giảng dạy 1 kèm 1. Giảng viên có thể tập trung hoàn toàn vào việc hướng dẫn mình, điều chỉnh tốc độ học phù hợp với khả năng tiếp thu. Điều này giúp mình học hiệu quả hơn rất nhiều so với học nhóm.',
    rating: 4.5
  }
];

const generateReviewsForCourse = async () => {
  try {
    // Get all courses
    const Course = require('../models/Course');
    const courses = await Course.find({ isActive: true });
    
    console.log(`Found ${courses.length} courses`);
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Generate 10 reviews for each course
    const allReviews = [];
    
    for (const course of courses) {
      console.log(`Generating reviews for: ${course.title}`);
      
      // Create 10 unique reviews for this course
      const shuffled = [...reviewTemplates].sort(() => Math.random() - 0.5).slice(0, 10);
      for (let i = 0; i < shuffled.length; i++) {
        const template = shuffled[i];
        
        // Customize comment based on course category
        let customizedComment = template.comment;
        
        // Add course-specific touches
        if (course.category === 'Lập trình Kids') {
          customizedComment = customizedComment.replace('lập trình viên', 'người có tư duy logic')
                                               .replace('dự án thực tế', 'trò chơi thú vị')
                                               .replace('công ty', 'cộng đồng học tập');
        } else if (course.category === 'Frontend') {
          customizedComment = customizedComment.replace('ứng dụng', 'giao diện website')
                                               .replace('xây dựng', 'thiết kế');
        } else if (course.category === 'Backend') {
          customizedComment = customizedComment.replace('giao diện', 'hệ thống backend')
                                               .replace('thiết kế', 'xây dựng');
        }
        
        const review = {
          courseId: course._id,
          studentName: template.name,
          studentEmail: `student${i}_${course._id.toString().slice(-6)}@example.com`,
          rating: template.rating,
          comment: customizedComment,
          isApproved: true,
          userId: new mongoose.Types.ObjectId()
        };
        
        allReviews.push(review);
      }
    }
    
    // Insert all reviews
    await Review.insertMany(allReviews);
    console.log(`✅ Created ${allReviews.length} high-quality reviews`);
    
    // Update course ratings
    for (const course of courses) {
      const courseReviews = allReviews.filter(r => r.courseId.toString() === course._id.toString());
      const avgRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
      
      await Course.findByIdAndUpdate(course._id, {
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: courseReviews.length
      });
    }
    
    console.log('✅ Updated course ratings');
    
  } catch (error) {
    console.error('❌ Error generating reviews:', error);
  }
};

const main = async () => {
  await connectDB();
  await generateReviewsForCourse();
  process.exit(0);
};

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
