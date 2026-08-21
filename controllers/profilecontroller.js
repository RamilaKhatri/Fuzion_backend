const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "Profile not found" });
    res.json(user);
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "Profile not found" });
    const { name, email, currentPassword, newPassword } = req.body;
    if (name !== undefined && !name.trim()) return res.status(400).json({ message: "Name cannot be empty" });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please enter a valid email" });
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (email !== undefined) update.email = email.trim().toLowerCase();
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
      if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(401).json({ message: "Current password is incorrect" });
      if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
      update.password = await bcrypt.hash(newPassword, 10);
    }
    await user.update(update);
    const safe = await User.findByPk(user.id, { attributes: { exclude: ["password"] } });
    res.json({ message: "Profile updated successfully", user: safe });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") return res.status(409).json({ message: "Email already exists" });
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
