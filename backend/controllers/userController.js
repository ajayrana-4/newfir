const User = require('../models/User'); // Adjust the path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Basic user controller functions
const registerUser = async (req, res) => {
    try {
      const { name, email, password, phone, aadhar } = req.body;
      
      // Validate input
      if (!name || !email || !password || !phone || !aadhar) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
      
      // Check if user already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      const aadharExists = await User.findOne({ aadhar });
      if (aadharExists) {
        return res.status(400).json({ message: 'Aadhar number already registered' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        aadhar,
        password: hashedPassword
      });
      
      // Generate token for immediate login after registration
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          aadhar: user.aadhar
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 11000) { // MongoDB duplicate key error
        return res.status(400).json({ message: 'User with this email or Aadhar already exists' });
      }
      res.status(500).json({ message: 'Server error during registration' });
    }
  };

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send back user data and token with phone included
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,  // Added phone number
        aadhar: user.aadhar, // Added aadhar number
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Implementation will use req.user from the auth middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // Implementation will go here
    res.status(200).json({ message: 'User profile updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};