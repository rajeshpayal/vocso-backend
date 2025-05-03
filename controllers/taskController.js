const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, projectId, status } = req.body;

    // Check if project exists and belongs to user
    const project = await Project.findById(projectId);

    console.log("Project ID:", projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to add tasks to this project",
      });
    }

    // Create task
    const task = new Task({
      title,
      description,
      project: projectId,
      user: req.user.id,
      status: status || "To Do",
    });

    // increase number of tasks in project
    project.tasksCount = (project.tasksCount || 0) + 1;
    await project.save();

    // If task is marked as completed, set completedAt date
    if (task.status === "Completed") {
      task.completedAt = Date.now();
    }

    await task.save();

    console.log("Task created:", task);

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const mongoose = require("mongoose");

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID format",
      });
    }

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check ownership
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view tasks for this project",
      });
    }

    // Get tasks
    const tasks = await Task.find({ project: projectId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if the task belongs to the user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const { title, description, status } = req.body;

    const updateData = { title, description, status };

    if (status === "Completed" && task.status !== "Completed") {
      updateData.completedAt = Date.now();
    }

    if (status !== "Completed" && task.status === "Completed") {
      updateData.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteTask = async (req, res) => {
  // Validate taskId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }

    const task = await Task.findById(taskId);
    const project = await Project.findById(task.project);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();
    // Decrease number of tasks in project
    project.tasksCount = (project.tasksCount || 0) - 1;
    await project.save();

    res.json({
      success: true,
      message: "Task removed",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
