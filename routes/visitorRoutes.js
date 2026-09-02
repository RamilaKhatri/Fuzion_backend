const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminmiddleware");
const { trackVisit, getAnalytics } = require("../controllers/visitorController");

// Public - frontend pings on page view
router.post("/track", trackVisit);

// Admin - analytics summary
router.get("/analytics", adminMiddleware, getAnalytics);

module.exports = router;
