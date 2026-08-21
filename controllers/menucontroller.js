const MenuItem = require("../models/MenuItem");

// ==========================================
// CREATE MENU ITEM
// ==========================================

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      available,
      image,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !name ||
      !category ||
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        message: "Please enter a valid price",
      });
    }

    // -----------------------------
    // Create menu item
    // -----------------------------

    const menuItem = await MenuItem.create({
      name: String(name).trim(),

      category: String(category).trim(),

      price: Number(price),

      description:
        description !== undefined &&
        description !== null &&
        String(description).trim() !== ""
          ? String(description).trim()
          : null,

      // UploadThing URL
      image:
        image !== undefined &&
        image !== null &&
        String(image).trim() !== ""
          ? String(image).trim()
          : null,

      available:
        available === undefined
          ? true
          : String(available) === "true",
    });

    return res.status(201).json({
      message: "Menu Item Created Successfully",
      menuItem,
    });

  } catch (error) {

    console.error(
      "Create Menu Item Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create menu item",
      error: error.message,
    });
  }
};


// ==========================================
// GET ALL MENU ITEMS
// ==========================================

const getMenuItems = async (_req, res) => {
  try {

    const menuItems = await MenuItem.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(menuItems);

  } catch (error) {

    console.error(
      "Get Menu Items Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load menu items",
      error: error.message,
    });
  }
};


// ==========================================
// GET SINGLE MENU ITEM
// ==========================================

const getMenuItemById = async (req, res) => {
  try {

    const menuItem =
      await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu Item Not Found",
      });
    }

    return res.status(200).json(menuItem);

  } catch (error) {

    console.error(
      "Get Single Menu Item Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to load menu item",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE MENU ITEM
// ==========================================

const updateMenuItem = async (req, res) => {
  try {

    const menuItem =
      await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu Item Not Found",
      });
    }

    const {
      name,
      category,
      price,
      description,
      available,
      image,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (
      !name ||
      !category ||
      price === undefined ||
      price === ""
    ) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        message: "Please enter a valid price",
      });
    }

    // -----------------------------
    // Prepare update data
    // -----------------------------

    const updateData = {
      name: String(name).trim(),

      category: String(category).trim(),

      price: Number(price),

      description:
        description !== undefined &&
        description !== null &&
        String(description).trim() !== ""
          ? String(description).trim()
          : null,

      available:
        available === undefined
          ? menuItem.available
          : String(available) === "true",
    };

    /*
      Only replace image when frontend
      sends a new image URL.

      If no new image was selected,
      existing image remains unchanged.
    */

    if (
      image !== undefined &&
      image !== null &&
      String(image).trim() !== ""
    ) {
      updateData.image =
        String(image).trim();
    }

    // -----------------------------
    // Update database
    // -----------------------------

    await menuItem.update(updateData);

    return res.status(200).json({
      message: "Menu Item Updated Successfully",
      menuItem,
    });

  } catch (error) {

    console.error(
      "Update Menu Item Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to update menu item",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE MENU ITEM
// ==========================================

const deleteMenuItem = async (req, res) => {
  try {

    const menuItem =
      await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu Item Not Found",
      });
    }

    // Delete only DB record.
    // UploadThing file is not deleted here.
    await menuItem.destroy();

    return res.status(200).json({
      message: "Menu Item Deleted Successfully",
    });

  } catch (error) {

    console.error(
      "Delete Menu Item Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE AVAILABILITY
// ==========================================

const updateAvailability = async (req, res) => {
  try {

    const menuItem =
      await MenuItem.findByPk(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu Item Not Found",
      });
    }

    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        message: "Available must be true or false",
      });
    }

    await menuItem.update({
      available,
    });

    return res.status(200).json({
      message:
        "Menu Item Availability Updated",
      menuItem,
    });

  } catch (error) {

    console.error(
      "Update Availability Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update availability",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
};