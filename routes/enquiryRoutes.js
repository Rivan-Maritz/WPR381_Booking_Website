const express = require("express");
const router = express.Router();
const { submitEnquiry } = require("../controllers/enquiryController");

router.get("/contact", (req, res) => {
  console.log("Route Recieved");
  res.render("enquiries/contact", {
    user: req.session.user || null
  });
});

router.post("/contact", submitEnquiry);

module.exports = router;
