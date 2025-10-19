const express = require('express');
const {
  register,
  login,
  getUser,
  logout,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', auth, getUser);
router.post('/logout', logout);

module.exports = router;