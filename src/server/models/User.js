// Module dependencies
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');

// Constants
const SECRET = config.get('token.secret');

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
  const User = this;
  let decoded;

  // Verify the token
  try {
    decoded = jwt.verify(token, SECRET);
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

// Find user by credentials (model method)
UserSchema.statics.findByCredentials = function(email, password) {
  // Variables
  const User = this;

  // Find the associate email if any and return a Promise
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    // Compare passwords
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, response) => {
        if (response) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
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
    .sign({ _id: user._id.toHexString(), access }, SECRET)
    .toString();

  // Update tokens
  user.tokens = user.tokens.concat([{ access, token }]);

  // Save the document and return a Promise including the token
  return user.save().then(() => token);
};

// Remove JWT (instance method)
UserSchema.methods.removeToken = function(token) {
  // Variables
  const user = this;

  // Remove JWT from the document and return a Promise
  return user.update({
    $pull: {
      tokens: { token }
    }
  });
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
