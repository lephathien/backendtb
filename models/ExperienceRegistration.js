const mongoose = require('mongoose');

const experienceRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  contactedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
experienceRegistrationSchema.index({ phone: 1 });
experienceRegistrationSchema.index({ registeredAt: -1 });
experienceRegistrationSchema.index({ status: 1 });

module.exports = mongoose.model('ExperienceRegistration', experienceRegistrationSchema);
