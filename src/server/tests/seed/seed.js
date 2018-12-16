// Module dependencies
const config = require('config');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { Todo } = require('../../models/Todo');
const { User } = require('../../models/User');

// Constants
const SECRET = config.get('token.secret');

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
        token: jwt.sign({ _id: userOneId, access: 'auth' }, SECRET).toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'rob@mail.com',
    password: 'userTwoPassword',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, SECRET).toString()
      }
    ]
  }
];

// Todos
const TODOS = [
  {
    _id: new ObjectID(),
    _creator: userOneId,
    text: 'Buy pencils'
  },
  {
    _id: new ObjectID(),
    _creator: userTwoId,
    text: 'Pay internet bill',
    completed: true,
    completedAt: 1543416161337
  }
];

// Populate Todos
const populateTodos = (done) => {
  // Remove all documents from todos collection
  Todo.deleteMany({})
    .then(() => Todo.insertMany(TODOS))
    .then(() => done());
};

// Populate Users
const populateUsers = (done) => {
  // Remove all documents from users collection
  User.deleteMany({})
    .then(() => {
      // Add user documents
      const userOne = new User(USERS[0]).save();
      const userTwo = new User(USERS[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

// Module exports
module.exports = {
  populateTodos, populateUsers, TODOS, USERS
};
