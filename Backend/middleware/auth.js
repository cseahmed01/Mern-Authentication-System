const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Basic authentication middleware
const authenticate = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;

    // Fetch user from database to get role
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user.role = user.role;
    req.userData = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize('admin');

// Moderator and Admin middleware
const moderatorAndAbove = authorize('moderator', 'admin');

// Admin or Moderator middleware (for read access)
const adminOrModerator = authorize('admin', 'moderator');

// Export both middlewares
module.exports = {
  authenticate,
  authorize,
  adminOnly,
  moderatorAndAbove,
  adminOrModerator
};