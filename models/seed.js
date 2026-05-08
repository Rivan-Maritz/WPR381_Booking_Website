require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../models/db');

const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Event.deleteMany();
  await Booking.deleteMany();
  await Enquiry.deleteMany();
  console.log('Cleared existing data');

  // --- Users ---
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@advancedevents.co.za',
    password: 'Admin@1234',
    role: 'admin',
  });

  const user1 = await User.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'User@1234',
    role: 'user',
  });

  const user2 = await User.create({
    name: 'John Smith',
    email: 'john@example.com',
    password: 'User@1234',
    role: 'user',
  });

  console.log('👤 Users seeded');

  // --- Events ---
  const event1 = await Event.create({
    title: 'Tech Summit 2026',
    description: 'A premier corporate technology conference covering AI, cloud, and software trends.',
    category: 'conference',
    date: new Date('2026-07-15'),
    location: 'Sandton Convention Centre, Johannesburg',
    totalCapacity: 200,
    bookedCount: 2,
    ticketPrice: 850,
    isActive: true,
    createdBy: admin._id,
  });

  const event2 = await Event.create({
    title: 'Creative Writing Workshop',
    description: 'An interactive workshop for aspiring writers led by industry professionals.',
    category: 'workshop',
    date: new Date('2026-08-03'),
    location: 'Cape Town City Hall',
    totalCapacity: 50,
    bookedCount: 1,
    ticketPrice: 300,
    isActive: true,
    createdBy: admin._id,
  });

  const event3 = await Event.create({
    title: 'Summer Music Festival',
    description: 'A two-day outdoor music festival featuring local and international artists.',
    category: 'festival',
    date: new Date('2026-12-20'),
    location: 'Moses Mabhida Stadium, Durban',
    totalCapacity: 5000,
    bookedCount: 0,
    ticketPrice: 450,
    isActive: true,
    createdBy: admin._id,
  });

  console.log('📅 Events seeded');

  // --- Bookings ---
  await Booking.create({
    user: user1._id,
    event: event1._id,
    ticketsBooked: 1,
    status: 'confirmed',
    totalPrice: 850,
  });

  await Booking.create({
    user: user2._id,
    event: event1._id,
    ticketsBooked: 1,
    status: 'confirmed',
    totalPrice: 850,
  });

  await Booking.create({
    user: user1._id,
    event: event2._id,
    ticketsBooked: 1,
    status: 'confirmed',
    totalPrice: 300,
  });

  console.log('🎟️  Bookings seeded');

  // --- Enquiries ---
  await Enquiry.create({
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Refund Policy',
    message: 'Hi, I would like to know what the refund policy is for cancelled events.',
    status: 'unread',
    user: user1._id,
  });

  await Enquiry.create({
    name: 'Anonymous Visitor',
    email: 'visitor@example.com',
    subject: 'Group Bookings',
    message: 'Do you offer discounts for group bookings of 10 or more people?',
    status: 'unread',
    user: null,
  });

  console.log('📬 Enquiries seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('-----------------------------------');
  console.log('Admin login:  admin@advancedevents.co.za / Admin@1234');
  console.log('User login:   jane@example.com / User@1234');
  console.log('-----------------------------------');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
