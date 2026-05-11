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