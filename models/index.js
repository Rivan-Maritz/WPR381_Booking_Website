// Central export point for all models
// Usage in controllers: const { User, Event, Booking, Enquiry } = require('../models');

const User = require('./User');
const Event = require('./Event');
const Booking = require('./Booking');
const Enquiry = require('./Enquiry');

module.exports = { User, Event, Booking, Enquiry };
