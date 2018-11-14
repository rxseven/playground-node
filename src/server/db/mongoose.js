// Environment configuration
process.env['NODE_CONFIG_DIR'] = './config';

// Module dependencies
const config = require('config');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDB.URI, { useNewUrlParser: true });
mongoose.connection.on('error', err => {
  console.error(err);
});

// Module exports
module.exports = { mongoose };
