const { check } = require('express-validator');

module.exports = {
  createProject: [
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Project description is required').not().isEmpty()
  ],
  updateProject: [
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Project description is required').not().isEmpty()
  ]
};