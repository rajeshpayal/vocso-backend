const { check } = require('express-validator');

module.exports = {
  createTask: [
    check('title', 'Task title is required').not().isEmpty(),
    check('description', 'Task description is required').not().isEmpty(),
    check('projectId', 'Project ID is required').not().isEmpty(),
    check('status', 'Status must be one of: To Do, In Progress, Completed')
      .optional()
      .isIn(['To Do', 'In Progress', 'Completed'])
  ],
  updateTask: [
    check('title', 'Task title is required').not().isEmpty(),
    check('description', 'Task description is required').not().isEmpty(),
    check('status', 'Status must be one of: To Do, In Progress, Completed')
      .isIn(['To Do', 'In Progress', 'Completed'])
  ],
  deleteTask: [
    check('taskId', 'Task ID is required').not().isEmpty()
  ]
};