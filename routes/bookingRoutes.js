const express = require("express");
const router = express.Router();
const bookController = require('../controllers/bookController');
const {isAuthenticated, isAdmin} = require('../middleware/authMiddleware');

// Debug route - check if session is working
router.get('/check-session', (req, res) => {
    res.json({
        sessionUser: req.session.user,
        hasUser: !!req.session.user
    });
});

router.get('/book', bookController.GetAllEvents); 
router.post('/book/create/:eventId', (req, res, next) => {
    console.log('Before auth - Session:', req.session.user);
    next();
}, isAuthenticated, bookController.createBooking);

module.exports = router;