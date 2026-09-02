const Notification = require("../models/Notification");

const createNotification = async ({ type, title, message, link = null, relatedId = null }) => {
    try {
        return await Notification.create({ type, title, message, link, relatedId, read: false });
    } catch (e) {
        console.error("createNotification failed:", e.message);
        return null;
    }
};

module.exports = { createNotification };
