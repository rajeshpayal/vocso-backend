const { check } = require('express-validator');

module.exports = {
  register: [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('country', 'Country is required').not().isEmpty()
  ],
  login: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ]
};