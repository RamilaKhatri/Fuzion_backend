const authMiddleware = require("./authmiddleware");

const adminMiddleware = (req, res, next) => {
  // First verify JWT
  authMiddleware(req, res, () => {
    // Check admin role
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    next();
  });
};

module.exports = adminMiddleware;