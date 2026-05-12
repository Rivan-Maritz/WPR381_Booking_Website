const Event = require("../models/Event");

exports.getAllEvents = async (req, res) => {
    try {

        console.log("=" .repeat(50));
        console.log("✅ getAllEvents CONTROLLER WAS CALLED!");
        console.log("Full URL:", req.originalUrl);
        console.log("Query params:", req.query);
        console.log("Session user:", req.session?.user);
        console.log("=" .repeat(50));

        const { search, category, date, availability } = req.query;

        let query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);

            query.date = {
                $gte: start,
                $lt: end
            };
        }

        if (availability === "available") {
            query.$expr = { $lt: ["$bookedCount", "$totalCapacity"] };
        }

        if (availability === "soldout") {
            query.$expr = { $gte: ["$bookedCount", "$totalCapacity"] };
        }

        const events = await Event.find(query).sort({ date: 1 });

        res.render("events/home", {
            events,
            search: search || "",
            category: category || "",
            date: date || "",
            availability: availability || "",
            user: req.session.user || null
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.getManageEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.render("events/manageEvents", { events });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, category, date, location, price, totalCapacity, description } = req.body;
        const createdBy = req.user?.id || req.session?.user?.id;

        await Event.create({
            title,
            description: description?.trim() || `${title} event created by admin`,
            category,
            date,
            location,
            ticketPrice: parseFloat(price) || 0,
            totalCapacity: parseInt(totalCapacity, 10) || 0,
            createdBy,
        });

        res.redirect("/events/manageEvents");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, category, date, location, price, totalCapacity } = req.body;

        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                title,
                category,
                date,
                location,
                ticketPrice: parseFloat(price) || 0,
                totalCapacity: parseInt(totalCapacity, 10) || 0,
            },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).send("Event not found");
        }

        res.redirect("/events/manageEvents");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        await Event.findByIdAndDelete(eventId);
        res.redirect("/events/manageEvents");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};