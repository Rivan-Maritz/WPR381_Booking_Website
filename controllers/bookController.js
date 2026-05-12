const Booking = require('../models/Booking');
const Event = require('../models/Event');


const GetAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ date: 1 });
        res.render("bookings/book", {  
            events,
            user: req.session.user || null,
            message: req.session.message || null,
            error: req.session.error || null
        });
        
        // Clear messages after rendering
        req.session.message = null;
        req.session.error = null;
    } catch (err) {
        console.error('Error in GetAllEvents:', err);
        next(err);
    }
}

const createBooking = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { ticketsBooked } = req.body; // Get number of tickets from form
        
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            req.session.error = 'Please login to book tickets';
            return res.redirect('/auth/login');
        }
        
        const userId = req.user.id;

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            req.session.error = 'Event not found';
            return res.redirect('/bookings/book');
        }

        // Check if event is active
        if (!event.isActive) {
            req.session.error = 'This event is no longer active';
            return res.redirect('/bookings/book');
        }

        // Check if event is sold out
        if (event.isSoldOut) {
            req.session.error = 'Sorry, this event is sold out';
            return res.redirect('/bookings/book');
        }

        // Check if user already booked this event
        const existingBooking = await Booking.findOne({ 
            user: userId, 
            event: eventId,
            status: { $ne: 'cancelled' }
        });
        
        if (existingBooking) {
            req.session.error = 'You have already booked this event';
            return res.redirect('/bookings/book');
        }

        // Check available seats
        const availableSeats = event.availableSeats;
        const ticketsToBook = parseInt(ticketsBooked) || 1;

        if (ticketsToBook > availableSeats) {
            req.session.error = `Only ${availableSeats} ticket(s) available`;
            return res.redirect('/bookings/book');
        }

        // Calculate total price
        const totalPrice = event.ticketPrice * ticketsToBook;

        // Generate unique QR code reference
        const qrCodeReference = `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        // Create the booking
        const booking = new Booking({
            user: userId,
            event: eventId,
            ticketsBooked: ticketsToBook,
            status: 'confirmed',
            totalPrice: totalPrice,
            paymentStatus: 'pending',
            qrCodeReference: qrCodeReference
        });

        await booking.save();

        // Update the event's booked count
        event.bookedCount += ticketsToBook;
        await event.save();

        req.session.message = `Successfully booked ${ticketsToBook} ticket(s) for ${event.title}!`;
        res.redirect('/bookings/book');

    } catch (error) {
        console.error('Booking error:', error);
        
        // Handle duplicate key error (user already booked this event)
        if (error.code === 11000) {
            req.session.error = 'You have already booked this event';
        } else {
            req.session.error = 'Failed to create booking. Please try again.';
        }
        
        res.redirect('/bookings/book');
    }
};


module.exports = {
    GetAllEvents,
    createBooking
};