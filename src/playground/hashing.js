// Module dependencies
const { SHA256 } = require('crypto-js');

// Dummy data
const message = 'I am a user';
const hash = SHA256(message).toString();

// Logs
console.log('Message:', message);
console.log('Hash:', hash);

// Initial state
const data = { id: 4 };
const token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

// Modify state
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

// State validation
const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
  console.log('Data was not changed');
} else {
  console.log('Data was changed. Do not trust!');
}
