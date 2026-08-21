const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminmiddleware");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
} = require("../controllers/usercontroller");


// Get all users
router.get("/", adminMiddleware, getUsers);

// Create new user
router.post("/", adminMiddleware, createUser);

// Get single user
router.get("/:id", adminMiddleware, getUserById);

// Update user
router.put("/:id", adminMiddleware, updateUser);

// Update status
router.patch("/:id/status", adminMiddleware, updateUserStatus);

// Delete user
router.delete("/:id", adminMiddleware, deleteUser);


module.exports = router;