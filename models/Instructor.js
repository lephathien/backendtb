const mongoose = require('mongoose');

const InstructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add instructor name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Please add instructor bio'],
    maxlength: [500, 'Bio can not be more than 500 characters']
  },
  avatar: {
    type: String,
    default: 'no-avatar.jpg'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must can not be more than 5'],
    default: 4.5
  },
  coursesCount: {
    type: Number,
    default: 0
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  expertise: {
    type: String,
    required: [true, 'Please add expertise area'],
    maxlength: [100, 'Expertise can not be more than 100 characters']
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: [0, 'Experience cannot be negative']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  socialMedia: {
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number
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

// Virtual populate courses
InstructorSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'instructorId',
  justOne: false
});

// Pre-save middleware to update courses count
InstructorSchema.pre('save', async function(next) {
  if (this.isModified('coursesCount') || this.isNew) {
    const Course = this.model('Course');
    const coursesCount = await Course.countDocuments({ instructorId: this._id, isActive: true });
    this.coursesCount = coursesCount;
  }
  next();
});

module.exports = mongoose.model('Instructor', InstructorSchema);
