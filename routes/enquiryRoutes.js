const express = require("express");
const router = express.Router();
const { submitEnquiry } = require("../controllers/enquiryController");

router.get("/", (req, res) => {
  res.render("enquiries/contact");
});

router.post("/", submitEnquiry);

module.exports = router;
