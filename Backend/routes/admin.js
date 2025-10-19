const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');
const { authenticate, adminOnly, adminOrModerator } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// User management routes - Read access for moderators and admins
router.get('/users', adminOrModerator, getAllUsers);
router.get('/users/:id', adminOrModerator, getUserById);
router.get('/stats', adminOrModerator, getUserStats);

// Write operations - Admin only
router.put('/users/:id/role', adminOnly, updateUserRole);
router.delete('/users/:id', adminOnly, deleteUser);

module.exports = router;