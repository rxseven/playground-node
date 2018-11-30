// Module dependencies
const jwt = require('jsonwebtoken');

// Initial state
const data = { id: 4 };

// Secret
const secret = 'somesecret';

// Sign token
const token = jwt.sign(data, secret);

// Verify token
const decoded = jwt.verify(token, secret);

// Logs
console.log('Data:', data);
console.log('Token:', token);
console.log('Decoded:', decoded);
