const express = require("express");
const router = express.Router();
const { register, login, adminLogin, makeAdmin } = require("../controllers/authcontroller");
const adminMiddleware = require("../middleware/adminmiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);

// Existing setup endpoint retained but protected.
// An already authenticated admin can promote a user.
router.put("/make-admin", adminMiddleware, makeAdmin);

module.exports = router;
