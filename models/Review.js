const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  studentName: {
    type: String,
    required: [true, 'Please add student name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  studentEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment can not be more than 1000 characters']
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isHelpful: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient queries
ReviewSchema.index({ courseId: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1 });

// Static method to get average rating and save to course
ReviewSchema.statics.getAverageRating = async function(courseId) {
  const obj = await this.aggregate([
    {
      $match: { courseId: courseId, isApproved: true }
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
    const Course = this.model('Course');
    if (obj.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].totalReviews
      });
    } else {
      await Course.findByIdAndUpdate(courseId, {
        rating: 4.5,
        reviewsCount: 0
      });
    }
  } catch (err) {
    console.error('Error updating course rating:', err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.courseId);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.courseId);
});

module.exports = mongoose.model('Review', ReviewSchema);
