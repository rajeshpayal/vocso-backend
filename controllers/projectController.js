const Project = require("../models/Project");
const { validationResult } = require("express-validator");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already has 4 projects
    const projectCount = await Project.countDocuments({ user: req.user.id });

    if (projectCount >= 4) {
      return res.status(400).json({
        success: false,
        message: "User can have a maximum of 4 projects",
      });
    }

    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      user: req.user.id,
    });

    await project.save();

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if the project belongs to the user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this project",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if the project belongs to the user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    const { name, description } = req.body;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if the project belongs to the user
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this project",
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: "Project removed",
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
