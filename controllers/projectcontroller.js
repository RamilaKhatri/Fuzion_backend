const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const allowedStatuses = ["Pending", "In Progress", "Completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid project status" });
    }

    const project = await Project.create({
      title,
      description,
      status: status || "Pending",
    });

    res.status(201).json({
      message: "Project Created Successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    const { title, description, status } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const allowedStatuses = ["Pending", "In Progress", "Completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid project status" });
    }

    await project.update({
      title,
      description,
      status: status || project.status,
    });

    res.status(200).json({
      message: "Project Updated Successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project Not Found",
      });
    }

    await project.destroy();

    res.status(200).json({
      message: "Project Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};