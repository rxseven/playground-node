// Module dependencies
const { ObjectID } = require('mongodb');

// Todos
const TODOS = [
  {
    _id: new ObjectID(),
    text: 'Buy pencils'
  },
  {
    _id: new ObjectID(),
    text: 'Pay internet bill',
    completed: true,
    completedAt: 1543416161337
  }
];

// Module exports
module.exports = { TODOS };
