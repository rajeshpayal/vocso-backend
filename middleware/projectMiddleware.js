const Project = require("../models/Project");

const validateProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this project",
      });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during project validation",
    });
  }
};

module.exports = validateProjectAccess;
