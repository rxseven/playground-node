// Module dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');

// Schema
const UserSchema = new mongoose.Schema({
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

// Find user by token (model method)
UserSchema.statics.findByToken = function(token) {
  // Variables
  const user = this;
  let decoded;

  // Verify the token
  try {
    decoded = jwt.verify(token, 'somesecret');
  } catch (error) {
    return Promise.reject();
  }

  // Find the associate user if any and return a Promise
  return User.findOne({
    _id: decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  });
};

// toJSON (overriding the Mongoose method)
UserSchema.methods.toJSON = function() {
  // Variables
  const user = this;

  // Convert the user document into a plain javascript object
  const userObject = user.toObject();

  // Pick off properties from the user object and return a new object
  return _.pick(userObject, ['_id', 'email']);
};

// Generate JWT (instance method)
UserSchema.methods.generateAuthToken = function() {
  // Variables
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, 'somesecret')
    .toString();

  // Update tokens
  user.tokens = user.tokens.concat([{ access, token }]);

  // Save the document and return a Promise including the token
  return user.save().then(() => token);
};

// Do something before saving the document
UserSchema.pre('save', function(next) {
  // Variables
  const user = this;

  // Encrypt the password if it was modified
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        // Update the plain password with the hashed one
        user.password = hash;

        // Call the next middleware
        next();
      });
    });
  } else {
    // Call the next middleware
    next();
  }
});

// Model
const User = mongoose.model('User', UserSchema);

// Module exports
module.exports = { User };
