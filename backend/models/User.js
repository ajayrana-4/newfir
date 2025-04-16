// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,  // Aadhar numbers should be unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'citizen',  // Default role is citizen, police is the other option
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;