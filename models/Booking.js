const mongoose = require('mongoose');

// TODO Ofentse: Add payment status, QR code reference, cancellation logic
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    ticketsBooked: {
      type: Number,
      required: [true, 'Number of tickets is required'],
      min: [1, 'Must book at least 1 ticket'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    // ADDED: tracks whether the user has paid for this booking
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    // ADDED: unique reference string used to generate a QR code on the ticket
    qrCodeReference: {
      type: String,
      default: null,
    },
    // ADDED: records exactly when a booking was cancelled
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent the same user from booking the same event twice
// TODO Ofentse: Remove this if multiple bookings per user per event should be allowed
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
