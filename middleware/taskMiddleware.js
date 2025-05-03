const Task = require("../models/Task");

const validateTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this task",
      });
    }

    req.task = task;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during task validation",
    });
  }
};

module.exports = validateTaskAccess;
