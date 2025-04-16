const express = require('express');
const router = express.Router();
// Import your controllers - adjust paths as needed for your project
const userController = require('../controllers/userController');
// Import middleware if needed - adjust paths as needed
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

// Export the router
module.exports = router;