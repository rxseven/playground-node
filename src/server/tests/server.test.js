// Module dependencies
const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

// Configuration
beforeEach(function(done) {
  // Disable timeout for a hook
  this.timeout(0);

  // Remove all documents from todos collection
  Todo.deleteMany({}).then(() => done());
});

// Test suites
describe('POST /todos', function() {
  // Disable timeout for test suite
  this.timeout(0);
});