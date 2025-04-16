const User = require('../models/User');

// Middleware to check if user is an admin or police
const isAdminOrPolice = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }
    
    // Check if user has admin or police role
    if (req.user.role !== 'admin' && req.user.role !== 'police') {
      return res.status(403).json({ message: 'Access denied: Admin or Police role required' });
    }
    
    return next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { isAdminOrPolice };