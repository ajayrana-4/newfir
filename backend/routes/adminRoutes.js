const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FIR = require('../models/Firnum');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user with police role
    const user = await User.findOne({ email, role: 'police' });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or not authorized as police' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
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
});

// Get all FIRs for admin
router.get('/firs', protect, async (req, res) => {
  try {
    // Check if user is police
    if (req.user.role !== 'police') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const firs = await FIR.find().sort({ createdAt: -1 });
    res.json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get FIR by ID for admin
router.get('/firs/:id', protect, async (req, res) => {
  try {
    // Check if user is police
    if (req.user.role !== 'police') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const fir = await FIR.findById(req.params.id);
    
    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }
    
    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update FIR status
router.put('/firs/:id/status', protect, async (req, res) => {
  try {
    // Check if user is police
    if (req.user.role !== 'police') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { status, comment } = req.body;
    
    const fir = await FIR.findById(req.params.id);
    
    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }
    
    // Add status update
    fir.statusUpdates.push({
      status,
      comment,
      date: new Date()
    });
    
    // Update main status
    fir.status = status;
    fir.statusUpdateDate = new Date();
    
    await fir.save();
    
    res.json({
      message: 'Status updated successfully',
      fir
    });
  } catch (error) {
    console.error('Error updating FIR status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a police user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, aadhar } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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
      password: hashedPassword,
      role: 'police'
    });
    
    res.status(201).json({
      message: 'Police user registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;