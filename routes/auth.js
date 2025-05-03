const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const authValidation = require('../validations/authValidation');

router.route('/register')
  .post(validate(authValidation.register), authController.registerUser);

router.route('/login')
  .post(validate(authValidation.login), authController.loginUser);

router.route('/me')
  .get(authMiddleware, authController.getUserProfile);

module.exports = router;
