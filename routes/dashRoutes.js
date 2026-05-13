const express = require("express");
const router = express.Router();
const dashController = require('../controllers/dashController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Apply admin authentication to all analytics routes
router.use(isAuthenticated, isAdmin);

// Main dashboard route
router.get('/dashboard', dashController.getDashboardData);

// API endpoint for real-time stats (for AJAX updates)
router.get('/api/stats', dashController.getApiStats);

module.exports = router;