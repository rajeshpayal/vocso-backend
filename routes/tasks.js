const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const validateTaskAccess = require('../middleware/taskMiddleware');
const validate = require('../middleware/validate');
const taskValidation = require('../validations/taskValidation');

router.route('/')
  .post(authMiddleware, validate(taskValidation.createTask), taskController.createTask);

router.route('/projects/:projectId')
  .get(authMiddleware, taskController.getTasksByProject);

router.route('/:id')
  .get(authMiddleware, validateTaskAccess, taskController.getTaskById)
  .put(authMiddleware, validateTaskAccess, validate(taskValidation.updateTask), taskController.updateTask)
  .delete(authMiddleware, validateTaskAccess, taskController.deleteTask);

module.exports = router;