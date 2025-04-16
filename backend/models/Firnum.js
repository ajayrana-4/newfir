// backend/models/Firnum.js
const mongoose = require('mongoose');

// Sub-schema for status updates
const updateSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const firSchema = new mongoose.Schema({
  firNumber: {
    type: String,
    required: true,
    unique: true,
  },
  complainantName: {
    type: String,
    required: true,
  },
  complainantPhone: {
    type: String,
    required: true,
  },
  incidentType: {
    type: String,
    required: true,
  },
  incidentDate: {
    type: Date,
    required: true,
  },
  incidentLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  accusedName: {
    type: String,
  },
  status: {
    type: String,
    default: 'Filed',
    enum: ['Filed', 'Under Investigation', 'Resolved', 'Closed', 'Rejected']
  },
  statusUpdates: [updateSchema],
  statusUpdateDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const FIR = mongoose.model('FIR', firSchema);

module.exports = FIR;