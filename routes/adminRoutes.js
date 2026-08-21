const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminmiddleware");
const { getDashboard } = require("../controllers/admincontroller");

router.get("/dashboard", adminMiddleware, getDashboard);

module.exports = router;
