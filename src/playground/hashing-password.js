// Module dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dummy data
const password = 'somepassword';
let hashedPassword;

// Encrypt password
bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (error, hash) => {
    console.log('Hash:', hash);
  });
});

// Define hashed password
hashedPassword = '$2a$10$Ua/PTwFME0WakiwFM.TamOcXOz8MFBpFqP8T0ERiuTZz7jsXEjAAG';

// Compare passwords
bcrypt.compare(password, hashedPassword, (error, response) => {
  console.log('Response:', response);
});
