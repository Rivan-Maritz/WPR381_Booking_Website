const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// --- GET ROUTES (These render the visual EJS pages) ---

// Maps to: GET /auth/register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Maps to: GET /auth/login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// --- POST ROUTES (These handle the form submissions) ---

// Maps to: POST /auth/register
router.post("/register", registerUser);

// Maps to: POST /auth/login
router.post("/login", loginUser);

module.exports = router;
