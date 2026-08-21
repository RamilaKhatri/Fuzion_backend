const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");


const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
} = require("../controllers/menucontroller");

// ==========================================
// Public - Get All Menu Items
// ==========================================
router.get("/", getMenuItems);

// ==========================================
// Public - Get Single Menu Item
// ==========================================
router.get("/:id", getMenuItemById);

// ==========================================
// Admin - Create Menu Item
// ==========================================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createMenuItem
);

// ==========================================
// Admin - Update Menu Item
// ==========================================
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateMenuItem
);

// ==========================================
// Admin - Delete Menu Item
// ==========================================
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMenuItem
);

// ==========================================
// Admin - Update Availability
// ==========================================
router.patch(
  "/:id/availability",
  authMiddleware,
  adminMiddleware,
  updateAvailability
);

module.exports = router;