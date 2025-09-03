const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    maxlength: [200, 'Title can not be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Please add a course slug'],
    trim: true,
    unique: true,
    maxlength: [200, 'Slug can not be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  duration: {
    type: String,
    required: [true, 'Please add course duration']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Please add original price']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 4.5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    required: [true, 'Please add a course level'],
    enum: ['Cơ bản', 'Nâng cao', 'Chuyên gia']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category']
  },
  lessons: {
    type: Number,
    required: [true, 'Please add number of lessons']
  },
  skills: [{
    type: String,
    required: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  learningOutcomes: [{
    type: String
  }],
  prerequisites: [{
    type: String
  }],
  targetAudience: [{
    type: String
  }],
  curriculum: [{
    section: {
      type: String,
      required: true
    },
    lessons: [{
      type: String,
      required: true
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
CourseSchema.virtual('discount').get(function() {
  if (this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual populate reviews
CourseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false
});

// Static method to get average rating
CourseSchema.statics.getAverageRating = async function(courseId) {
  const obj = await this.model('Review').aggregate([
    {
      $match: { courseId: courseId }
    },
    {
      $group: {
        _id: '$courseId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.findByIdAndUpdate(courseId, {
      rating: obj[0].averageRating.toFixed(1),
      reviewsCount: obj[0].totalReviews
    });
  } catch (err) {
    console.error(err);
  }
};

// Automatically generate slug from title
CourseSchema.pre('validate', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
