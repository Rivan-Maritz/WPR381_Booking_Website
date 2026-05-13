const express = require("express");
const router = express.Router();
const dashController = require('../controllers/dashController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.use(isAuthenticated, isAdmin);

router.get('/dashboard', dashController.getDashboardData);

router.get('/api/stats', dashController.getApiStats);

module.exports = router;