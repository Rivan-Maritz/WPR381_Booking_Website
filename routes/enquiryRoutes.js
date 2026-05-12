const express = require("express");
const router = express.Router();
const enquiryController = require("../controllers/enquiryController");
const { isAdmin } = require("../middleware/authMiddleware");

router.get("/contact", (req, res) => {
  console.log("Route Recieved");
  res.render("enquiries/contact", {
    user: req.session.user || null
  });
});

router.post("/contact", enquiryController.submitEnquiry);

router.get("/manageContact", isAdmin, enquiryController.getManageContact);
router.post("/manageContact/:id/update", isAdmin, enquiryController.updateEnquiry);

module.exports = router;
