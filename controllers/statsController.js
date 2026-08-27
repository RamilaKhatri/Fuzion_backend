// controllers/statsController.js
const CafeStat = require("../models/CafeStat");

/* ==========================================
   PUBLIC — GET /api/stats/home
   Returns active stats, ordered, for the
   homepage cafe-stats section.
========================================== */
exports.getHomeStats = async (req, res) => {
    try {
        const stats = await CafeStat.findAll({
            where: { isActive: true },
            order: [["order", "ASC"]],
        });

        return res.status(200).json(stats);
    } catch (error) {
        console.error("getHomeStats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load cafe stats.",
        });
    }
};

/* ==========================================
   ADMIN — GET /api/admin/stats
========================================== */
exports.getAllStats = async (req, res) => {
    try {
        const stats = await CafeStat.findAll({
            order: [["order", "ASC"]],
        });

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("getAllStats error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch stats.",
        });
    }
};

/* ==========================================
   ADMIN — POST /api/admin/stats
========================================== */
exports.createStat = async (req, res) => {
    try {
        const { icon, targetValue, suffix, label, order, isActive } = req.body;

        if (!icon || targetValue === undefined || !label) {
            return res.status(400).json({
                success: false,
                message: "icon, targetValue and label are required.",
            });
        }

        const stat = await CafeStat.create({
            icon,
            targetValue,
            suffix: suffix ?? "+",
            label,
            order: order ?? 0,
            isActive: isActive ?? true,
        });

        return res.status(201).json({
            success: true,
            data: stat,
        });
    } catch (error) {
        console.error("createStat error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create stat.",
        });
    }
};

/* ==========================================
   ADMIN — PUT /api/admin/stats/:id
========================================== */
exports.updateStat = async (req, res) => {
    try {
        const { id } = req.params;

        const stat = await CafeStat.findByPk(id);

        if (!stat) {
            return res.status(404).json({
                success: false,
                message: "Stat not found.",
            });
        }

        const { icon, targetValue, suffix, label, order, isActive } = req.body;

        await stat.update({
            icon: icon ?? stat.icon,
            targetValue: targetValue ?? stat.targetValue,
            suffix: suffix ?? stat.suffix,
            label: label ?? stat.label,
            order: order ?? stat.order,
            isActive: isActive ?? stat.isActive,
        });

        return res.status(200).json({
            success: true,
            data: stat,
        });
    } catch (error) {
        console.error("updateStat error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update stat.",
        });
    }
};

/* ==========================================
   ADMIN — DELETE /api/admin/stats/:id
========================================== */
exports.deleteStat = async (req, res) => {
    try {
        const { id } = req.params;

        const stat = await CafeStat.findByPk(id);

        if (!stat) {
            return res.status(404).json({
                success: false,
                message: "Stat not found.",
            });
        }

        await stat.destroy();

        return res.status(200).json({
            success: true,
            message: "Stat deleted.",
        });
    } catch (error) {
        console.error("deleteStat error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete stat.",
        });
    }
};
