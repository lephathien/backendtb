const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên không được quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^(0|\+84)[3-9][0-9]{8}$/.test(v.replace(/\s/g, ''));
      },
      message: 'Số điện thoại không hợp lệ'
    }
  },
  subject: {
    type: String,
    required: [true, 'Chủ đề là bắt buộc'],
    enum: {
      values: ['course-inquiry', 'technical-support', 'partnership', 'other'],
      message: 'Chủ đề không hợp lệ'
    }
  },
  message: {
    type: String,
    required: [true, 'Tin nhắn là bắt buộc'],
    trim: true,
    maxlength: [2000, 'Tin nhắn không được quá 2000 ký tự']
  },
  status: {
    type: String,
    enum: ['new', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  replyMessage: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ subject: 1 });

// Virtual for subject display name
contactSchema.virtual('subjectDisplayName').get(function() {
  const subjectMap = {
    'course-inquiry': 'Tư vấn khóa học',
    'technical-support': 'Hỗ trợ kỹ thuật',
    'partnership': 'Hợp tác',
    'other': 'Khác'
  };
  return subjectMap[this.subject] || this.subject;
});

// Virtual for time ago
contactSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
});

// Static method to get contact statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    new: 0,
    replied: 0,
    closed: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Contact', contactSchema);
