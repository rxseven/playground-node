// Module dependencies
const { ObjectID } = require('mongodb');

const { Todo } = require('../../models/Todo');

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

// Populate Todos
const populateTodos = done => {
  // Remove all documents from todos collection
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(TODOS);
    })
    .then(() => done());
};

// Module exports
module.exports = { populateTodos, TODOS };
