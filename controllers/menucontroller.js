const fs = require("fs");
const path = require("path");
const MenuItem = require("../models/MenuItem");

const uploadsRoot = path.join(__dirname, "..", "uploads", "menu");

function removeMenuImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;

  const normalized = imageUrl.replace(/\\/g, "/");
  if (!normalized.startsWith("/uploads/menu/")) return;

  const filename = path.basename(normalized);
  const filePath = path.join(uploadsRoot, filename);

  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Could not remove old menu image:", error.message);
  }
}

function imagePathFromRequest(req) {
  return req.file ? `/uploads/menu/${req.file.filename}` : null;
}

// ==========================================
// Create Menu Item
// ==========================================
const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, available } = req.body;

    if (!name || !category || price === undefined || price === "") {
      if (req.file) removeMenuImage(imagePathFromRequest(req));
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      if (req.file) removeMenuImage(imagePathFromRequest(req));
      return res.status(400).json({
        message: "Please enter a valid price",
      });
    }

    const menuItem = await MenuItem.create({
      name: String(name).trim(),
      category: String(category).trim(),
      price: Number(price),
      description: description ? String(description).trim() : null,
      image: imagePathFromRequest(req),
      available: available === undefined ? true : String(available) === "true",
    });

    res.status(201).json({
      message: "Menu Item Created Successfully",
      menuItem,
    });
  } catch (error) {
    if (req.file) removeMenuImage(imagePathFromRequest(req));
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Get All Menu Items
// ==========================================
const getMenuItems = async (_req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Get Single Menu Item
// ==========================================
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu Item Not Found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Update Menu Item
// ==========================================
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      if (req.file) removeMenuImage(imagePathFromRequest(req));
      return res.status(404).json({ message: "Menu Item Not Found" });
    }

    const { name, category, price, description, available } = req.body;

    if (!name || !category || price === undefined || price === "") {
      if (req.file) removeMenuImage(imagePathFromRequest(req));
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      if (req.file) removeMenuImage(imagePathFromRequest(req));
      return res.status(400).json({ message: "Please enter a valid price" });
    }

    const oldImage = menuItem.image;
    const newImage = req.file ? imagePathFromRequest(req) : oldImage;

    await menuItem.update({
      name: String(name).trim(),
      category: String(category).trim(),
      price: Number(price),
      description: description ? String(description).trim() : null,
      image: newImage,
      available:
        available === undefined
          ? menuItem.available
          : String(available) === "true",
    });

    if (req.file && oldImage && oldImage !== newImage) {
      removeMenuImage(oldImage);
    }

    res.status(200).json({
      message: "Menu Item Updated Successfully",
      menuItem,
    });
  } catch (error) {
    if (req.file) removeMenuImage(imagePathFromRequest(req));
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Delete Menu Item
// ==========================================
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu Item Not Found" });
    }

    const oldImage = menuItem.image;
    await menuItem.destroy();

    if (oldImage) removeMenuImage(oldImage);

    res.status(200).json({ message: "Menu Item Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Update Availability
// ==========================================
const updateAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu Item Not Found" });
    }

    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({ message: "Available must be true or false" });
    }

    await menuItem.update({ available });

    res.status(200).json({
      message: "Menu Item Availability Updated",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
};
