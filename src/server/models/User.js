// Module dependencies
const mongoose = require('mongoose');

// Model
const User = mongoose.model('User', {
  email: {
    minlength: 1,
    required: true,
    trim: true,
    type: String
  }
});

// Module exports
module.exports = { User }
