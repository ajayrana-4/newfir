const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      // Check if user exists
      if (!req.user) {
        console.log('User not found with ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User authenticated:', req.user._id);
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  }

  // If no token provided
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };