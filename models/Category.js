const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Please add a category slug'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Slug can not be more than 50 characters']
  },
  icon: {
    type: String,
    default: '📚',
    maxlength: [10, 'Icon can not be more than 10 characters']
  },
  description: {
    type: String,
    default: '',
    maxlength: [200, 'Description can not be more than 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
