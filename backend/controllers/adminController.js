const User = require('../models/User');
const FIR = require('../models/Firnum');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find police user by email
    const user = await User.findOne({ 
      email, 
      role: 'police'
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or insufficient permissions' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send back user data and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all FIRs for admin
const getAllFIRs = async (req, res) => {
  try {
    // Get FIRs with optional status filter
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const firs = await FIR.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .populate('user', 'name email phone'); // populate user details
    
    res.json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ message: 'Error fetching FIRs', error: error.message });
  }
};

// Get a single FIR detail
const getFIRDetail = async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }
    
    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR detail:', error);
    res.status(500).json({ message: 'Error fetching FIR detail', error: error.message });
  }
};

// Update FIR status
const updateFIRStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Find the FIR
    const fir = await FIR.findById(req.params.id);
    
    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }
    
    // Create status update
    const statusUpdate = {
      status,
      comment: comment || '',
      date: new Date()
    };
    
    // Update the FIR
    fir.status = status;
    fir.statusUpdates.push(statusUpdate);
    fir.statusUpdateDate = new Date();
    
    await fir.save();
    
    res.json({
      message: 'FIR status updated successfully',
      fir
    });
  } catch (error) {
    console.error('Error updating FIR status:', error);
    res.status(500).json({ message: 'Error updating FIR status', error: error.message });
  }
};

// Register a police user
const registerPoliceUser = async (req, res) => {
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
    
    // Create police user
    const user = await User.create({
      name,
      email,
      phone,
      aadhar,
      role: 'police',
      password: hashedPassword
    });
    
    res.status(201).json({
      message: 'Police user registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ message: 'User with this email or Aadhar already exists' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  adminLogin,
  getAllFIRs,
  getFIRDetail,
  updateFIRStatus,
  registerPoliceUser
};