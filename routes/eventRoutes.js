const express = require("express");
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAdmin } = require('../middleware/authMiddleware');

router.get("/home", eventController.getAllEvents);

router.get("/manageEvents", isAdmin, eventController.getManageEvents);
router.post("/manageEvents/add", isAdmin, eventController.createEvent);
router.post("/manageEvents/:id/update", isAdmin, eventController.updateEvent);
router.post("/manageEvents/:id/delete", isAdmin, eventController.deleteEvent);

module.exports = router;