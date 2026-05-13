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
        const { ticketsBooked } = req.body;
        
        if (!req.user || !req.user.id) {
            req.session.error = 'Please login to book tickets';
            return res.redirect('/auth/login');
        }
        
        const userId = req.user.id;
 
        const event = await Event.findById(eventId);
        if (!event) {
            req.session.error = 'Event not found';
            return res.redirect('/bookings/book');
        }

        if (!event.isActive) {
            req.session.error = 'This event is no longer active';
            return res.redirect('/bookings/book');
        }

        if (event.isSoldOut) {
            req.session.error = 'Sorry, this event is sold out';
            return res.redirect('/bookings/book');
        }

        const existingBooking = await Booking.findOne({ 
            user: userId, 
            event: eventId,
            status: { $ne: 'cancelled' }
        });
        
        if (existingBooking) {
            req.session.error = 'You have already booked this event';
            return res.redirect('/bookings/book');
        }

        const availableSeats = event.availableSeats;
        const ticketsToBook = parseInt(ticketsBooked) || 1;

        if (ticketsToBook > availableSeats) {
            req.session.error = `Only ${availableSeats} ticket(s) available`;
            return res.redirect('/bookings/book');
        }

        const totalPrice = event.ticketPrice * ticketsToBook;

        const qrCodeReference = `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;

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

        event.bookedCount += ticketsToBook;
        await event.save();

        req.session.message = `Successfully booked ${ticketsToBook} ticket(s) for ${event.title}!`;
        res.redirect('/bookings/book');

    } catch (error) {
        console.error('Booking error:', error);
        
        if (error.code === 11000) {
            req.session.error = 'You have already booked this event';
        } else {
            req.session.error = 'Failed to create booking. Please try again.';
        }
        
        res.redirect('/bookings/book');
    }
};

const getActiveBookings = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.session.user?.id;
        if (!userId) {
            req.session.error = 'Please login to view your bookings';
            return res.redirect('/auth/login');
        }

        const bookings = await Booking.find({ user: userId })
            .populate({ path: 'event', select: 'title date ticketPrice location isActive' })
            .sort({ createdAt: -1 });

        res.render('bookings/activeBook', {
            bookings,
            user: req.session.user || null,
        });
    } catch (err) {
        console.error('Error in getActiveBookings:', err);
        next(err);
    }
};

module.exports = {
    GetAllEvents,
    createBooking,
    getActiveBookings
};