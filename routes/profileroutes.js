const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const { getProfile, updateProfile } = require("../controllers/profilecontroller");

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;
