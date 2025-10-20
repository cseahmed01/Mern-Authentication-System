const express = require('express');
const {
  register,
  login,
  getUser,
  logout,
  updateProfile,
  upload,
} = require('../controllers/authController');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register); // Require auth for registration to check admin role
router.post('/login', login);
router.get('/user', authenticate, getUser);
router.put('/profile', authenticate, upload.single('picture'), updateProfile);
router.post('/logout', logout);

module.exports = router;