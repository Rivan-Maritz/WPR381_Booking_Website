const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const events = await Event.find({ isActive: true }).sort({ date: 1 });
        res.render("bookings/book", {
            events,
            user: req.session.user || null,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;