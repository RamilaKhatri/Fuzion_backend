const express = require("express");
const router = express.Router();

const adminMiddleware = require("../middleware/adminmiddleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectcontroller");

// Create Project
router.post("/", adminMiddleware, createProject);

// Get All Projects
router.get("/", adminMiddleware, getProjects);

// Get Single Project
router.get("/:id", adminMiddleware, getProjectById);

// Update Project
router.put("/:id", adminMiddleware, updateProject);

// Delete Project
router.delete("/:id", adminMiddleware, deleteProject);

module.exports = router;