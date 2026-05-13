const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

module.exports = router;
