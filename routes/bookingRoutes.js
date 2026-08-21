const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");
const { createBooking, getBookings, getBookingById, updateBooking, updateBookingStatus, deleteBooking } = require("../controllers/bookingcontroller");

router.post("/", createBooking);
router.get("/", adminMiddleware, getBookings);
router.get("/:id", adminMiddleware, getBookingById);
router.put("/:id", adminMiddleware, updateBooking);
router.patch("/:id/status", adminMiddleware, updateBookingStatus);
router.delete("/:id", adminMiddleware, deleteBooking);

module.exports = router;
