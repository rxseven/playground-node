// Module dependencies
const mongoose = require('mongoose');
const validator = require('validator');

// Model
const User = mongoose.model('User', {
  email: {
    minlength: 1,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    minlength: 6,
    require: true,
    type: String
  },
  tokens: [
    {
      access: {
        require: true,
        type: String
      },
      token: {
        require: true,
        type: String
      }
    }
  ]
});

// Module exports
module.exports = { User };
