const Notification = require("../models/Notification");

const getNotifications = async (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const offset = parseInt(req.query.offset) || 0;
        const notifications = await Notification.findAll({
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });
        res.json(notifications);
    } catch (e) { next(e); }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.count({ where: { read: false } });
        res.json({ count });
    } catch (e) { next(e); }
};

const markAsRead = async (req, res, next) => {
    try {
        const n = await Notification.findByPk(req.params.id);
        if (!n) return res.status(404).json({ message: "Notification not found" });
        await n.update({ read: true });
        res.json({ message: "Marked as read", notification: n });
    } catch (e) { next(e); }
};

const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.update({ read: true }, { where: { read: false } });
        res.json({ message: "All marked as read" });
    } catch (e) { next(e); }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead };
