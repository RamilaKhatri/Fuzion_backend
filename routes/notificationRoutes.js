const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminmiddleware");
const {
    getNotifications, getUnreadCount, markAsRead, markAllAsRead
} = require("../controllers/notificationController");

router.get("/", adminMiddleware, getNotifications);
router.get("/unread-count", adminMiddleware, getUnreadCount);
router.patch("/:id/read", adminMiddleware, markAsRead);
router.patch("/read-all", adminMiddleware, markAllAsRead);

module.exports = router;
