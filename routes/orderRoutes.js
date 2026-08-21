const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminmiddleware");
const { createOrder, getOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder } = require("../controllers/ordercontroller");

router.post("/", createOrder);
router.get("/", adminMiddleware, getOrders);
router.get("/:id", adminMiddleware, getOrderById);
router.put("/:id", adminMiddleware, updateOrder);
router.patch("/:id/status", adminMiddleware, updateOrderStatus);
router.delete("/:id", adminMiddleware, deleteOrder);

module.exports = router;
