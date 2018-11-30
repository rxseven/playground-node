// Module dependencies
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { Todo } = require('../../models/Todo');
const { User } = require('../../models/User');

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

// Users
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const USERS = [
  {
    _id: userOneId,
    email: 'john@mail.com',
    password: 'userOnePassword',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, 'somesecret')
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'rob@mail.com',
    password: 'userTwoPassword'
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
module.exports = { populateTodos, TODOS, USERS };
