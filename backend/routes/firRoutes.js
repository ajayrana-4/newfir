const express = require('express');
const FIR = require('../models/Firnum');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new FIR
router.post('/', protect, async (req, res) => {
  try {
    const {
      firNumber,
      complainantName,
      complainantPhone,
      incidentType,
      incidentDate,
      incidentLocation,
      description,
      accusedName,
    } = req.body;

    console.log('Received FIR data:', req.body);
    console.log('User from auth middleware:', req.user);

    // Validate required fields
    if (
      !firNumber ||
      !complainantName ||
      !complainantPhone ||
      !incidentType ||
      !incidentDate ||
      !incidentLocation ||
      !description
    ) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if FIR with this number already exists
    const existingFir = await FIR.findOne({ firNumber });
    if (existingFir) {
      console.log('FIR number already exists:', firNumber);
      return res.status(400).json({ message: 'FIR with this number already exists' });
    }

    // Create new FIR
    const fir = new FIR({
      firNumber,
      complainantName,
      complainantPhone,
      incidentType,
      incidentDate,
      incidentLocation,
      description,
      accusedName: accusedName || 'Unknown',
      status: 'Filed',
      user: req.user._id, // Make sure to use _id
    });

    const savedFir = await fir.save();
    console.log('FIR saved successfully:', savedFir._id);
    res.status(201).json(savedFir);
  } catch (error) {
    console.error('Error saving FIR:', error);
    res.status(400).json({ message: 'Error registering FIR', error: error.message });
  }
});

// Get all FIRs for a user
router.get('/', protect, async (req, res) => {
  try {
    const firs = await FIR.find({ user: req.user._id });
    res.json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ message: 'Error fetching FIRs', error: error.message });
  }
});

// Get FIR details by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id);
    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }
    
    // Ensure user can only access their own FIRs
    if (fir.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this FIR' });
    }
    
    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR details:', error);
    res.status(500).json({ message: 'Error fetching FIR', error: error.message });
  }
});

// PUBLIC ENDPOINT: Search FIR by FIR number (no authentication required)
router.get('/search/:firNumber', async (req, res) => {
  try {
    const { firNumber } = req.params;
    console.log('Searching for FIR number:', firNumber);
    
    if (!firNumber) {
      return res.status(400).json({ message: 'FIR number is required' });
    }
    
    // Find FIR by its number (public information + description)
    const fir = await FIR.findOne({ firNumber }).select(
      'firNumber incidentType incidentDate incidentLocation description accusedName status createdAt statusUpdateDate'
    );
    
    if (!fir) {
      return res.status(404).json({ message: 'No FIR found with this number' });
    }
    
    // Return public information with description
    res.json(fir);
  } catch (error) {
    console.error('Error searching for FIR:', error);
    res.status(500).json({ message: 'Error searching for FIR', error: error.message });
  }
});

module.exports = router;