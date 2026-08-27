// routes/statsRoutes.js

const express = require("express");
const router = express.Router();

const statsController = require("../controllers/statsController");
const adminMiddleware = require("../middleware/adminmiddleware");


// =====================================================
// PUBLIC
// GET /api/stats/home
// =====================================================

router.get("/home", statsController.getHomeStats);


// =====================================================
// ADMIN
// GET    /api/admin/stats
// POST   /api/admin/stats
// PUT    /api/admin/stats/:id
// DELETE /api/admin/stats/:id
// =====================================================

router.get("/admin", adminMiddleware, statsController.getAllStats);

router.post("/admin", adminMiddleware, statsController.createStat);

router.put(
    "/admin/:id",
    adminMiddleware,
    statsController.updateStat
);

router.delete(
    "/admin/:id",
    adminMiddleware,
    statsController.deleteStat
);


module.exports = router;