const mongoose = require('mongoose');

const rtiApplicationSchema = new mongoose.Schema({
  applicant: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  pio: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    designation: {
      type: String,
      required: true,
      trim: true
    }
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali'],
    default: 'English'
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'responded', 'rejected', 'appealed'],
    default: 'draft'
  },
  submissionDate: {
    type: Date,
    default: null
  },
  responseDate: {
    type: Date,
    default: null
  },
  response: {
    type: String,
    default: null
  },
  appealDetails: {
    status: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected'],
      default: 'none'
    },
    reason: String,
    submissionDate: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
rtiApplicationSchema.index({ 'applicant.email': 1 });
rtiApplicationSchema.index({ status: 1 });
rtiApplicationSchema.index({ department: 1 });

const RTIApplication = mongoose.model('RTIApplication', rtiApplicationSchema);

module.exports = RTIApplication; 