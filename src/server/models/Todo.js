// Module dependencies
const mongoose = require('mongoose');

// Model
const Todo = mongoose.model('Todo', {
  text: {
    minlength: 1,
    required: true,
    trim: true,
    type: String
  },
  completed: {
    default: false,
    required: true,
    type: Boolean
  },
  completedAt: {
    default: null,
    type: Number
  }
});

// Module exports
module.exports = { Todo }
