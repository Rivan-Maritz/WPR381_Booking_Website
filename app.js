require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session"); // Added session requirement
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
// These 2 lines allow express to read the req.body (data coming from ejs forms and json requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure the Session Middleware to remember logged-in users
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Make sure this is defined in your .env file!
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Keep false for localhost. Set to true if deploying with HTTPS later.
      maxAge: 1000 * 60 * 60 * 24, // Session will expire after 1 day
    },
  }),
);

app.use((req,res,next) => {
  res.locals.user = req.session?.user || null;
  next();
})

const connectDB = require("./models/db");
connectDB();

app.set("view engine", "ejs");

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const enquiryRoutes = require("./routes/enquiryRoutes");
app.use("/enquiries", enquiryRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes );

const bookRoutes = require("./routes/bookingRoutes");
app.use("/bookings", bookRoutes);

const dashRoutes = require('./routes/dashRoutes');
app.use("/analytics", dashRoutes);

// Base route - temporarily pointing to the login page for testing
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/events");
  } else {
    res.render("auth/login");
  }
});

app.use(express.static("public"));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
