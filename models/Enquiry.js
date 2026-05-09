const mongoose = require('mongoose');

// TODO Ofentse: Add admin reply field, priority levels, or ticket reference
const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'resolved'],
      default: 'unread',
    },
    // Optional: link enquiry to a logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
     // ADDED: admin's written reply to this enquiry
    adminReply: {
      type: String,
      default: null,
    },
    // ADDED: timestamp of when the admin replied
    repliedAt: {
      type: Date,
      default: null,
    },
    // ADDED: priority level so admin can triage urgent enquiries first
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
