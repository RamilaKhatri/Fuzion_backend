const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ===============================
// GET ALL USERS
// ===============================
const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]]
        });

        res.json(users);
    } catch (error) {
        next(error);
    }
};


// ===============================
// GET USER BY ID
// ===============================
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        next(error);
    }
};


// ===============================
// CREATE USER
// ===============================
const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            status
        } = req.body;

        // Required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Validate email
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email"
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Validate role
        if (role && !["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // Validate status
        if (status && !["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        // Check existing email
        const existingUser = await User.findOne({
            where: {
                email: email.trim().toLowerCase()
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: role || "user",
            status: status || "active"
        });

        // Don't return password
        const safeUser = await User.findByPk(user.id, {
            attributes: { exclude: ["password"] }
        });

        res.status(201).json({
            message: "User created successfully",
            user: safeUser
        });

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        next(error);
    }
};


// ===============================
// UPDATE USER
// ===============================
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const {
            name,
            email,
            password,
            role,
            status
        } = req.body;

        // Validate email
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email"
            });
        }

        // Validate role
        if (role && !["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // Validate status
        if (status && !["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const update = {};

        if (name !== undefined) {
            update.name = name.trim();
        }

        if (email !== undefined) {
            update.email = email.trim().toLowerCase();
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                });
            }

            update.password = await bcrypt.hash(password, 10);
        }

        if (role !== undefined) {
            update.role = role;
        }

        if (status !== undefined) {
            update.status = status;
        }

        await user.update(update);

        const safeUser = await User.findByPk(user.id, {
            attributes: { exclude: ["password"] }
        });

        res.json({
            message: "User updated successfully",
            user: safeUser
        });

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        next(error);
    }
};


// ===============================
// DELETE USER
// ===============================
const deleteUser = async (req, res, next) => {
    try {

        // Prevent admin from deleting own account
        if (Number(req.params.id) === Number(req.user.id)) {
            return res.status(400).json({
                message: "You cannot delete your own admin account"
            });
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await user.destroy();

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};


// ===============================
// UPDATE USER STATUS
// ===============================
const updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        await user.update({
            status
        });

        res.json({
            message: "User status updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        next(error);
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
};