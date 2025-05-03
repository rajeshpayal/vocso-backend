const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const validateProjectAccess = require('../middleware/projectMiddleware');
const validate = require('../middleware/validate');
const projectValidation = require('../validations/projectValidation');

router.route('/')
  .post(authMiddleware, validate(projectValidation.createProject), projectController.createProject)
  .get(authMiddleware, projectController.getProjects);

router.route('/:id')
  .get(authMiddleware, validateProjectAccess, projectController.getProjectById)
  .put(authMiddleware, validateProjectAccess, validate(projectValidation.updateProject), projectController.updateProject)
  .delete(authMiddleware, validateProjectAccess, projectController.deleteProject);

module.exports = router;