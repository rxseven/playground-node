// Module dependencies
const { User } = require('../models/User');

// Middleware
const authenticate = (req, res, next) => {
  // Variables
  const token = req.header('x-auth');

  // Find a user by the given token
  User.findByToken(token)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      }

      // Append user and token to the request object
      req.user = user;
      req.token = token;

      // Call the next middleware
      next();
    })
    .catch(error => {
      res.status(401).send({ message: 'Unauthorized' });
    });
};

// Module exports
module.exports = { authenticate };
