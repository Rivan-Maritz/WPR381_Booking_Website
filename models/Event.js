const mongoose = require('mongoose');

// TODO Ofentse: Add fields like eventImage, ticketPrice tiers, tags, location coords
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['conference', 'workshop', 'festival', 'private', 'other'],
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      min: 1,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
     // ADDED: URL or filename of the event's banner image
    eventImage: {
      type: String,
      default: null,
    },
    // ADDED: array of tags for filtering (e.g. ['AI', 'networking'])
    tags: {
      type: [String],
      default: [],
    },
    // ADDED: optional GPS coordinates for map display
    locationCoords: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

// Virtual: available seats (not stored in DB, computed on the fly)
eventSchema.virtual('availableSeats').get(function () {
  return this.totalCapacity - this.bookedCount;
});

// Virtual: is the event sold out
eventSchema.virtual('isSoldOut').get(function () {
  return this.bookedCount >= this.totalCapacity;
});

// Ensure virtuals are included when converting to JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
