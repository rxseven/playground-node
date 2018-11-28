// Module dependencies
const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

// Initial todos
const TODOS = [
  {
    text: 'Buy pencils'
  },
  {
    text: 'Pay internet bill'
  }
];

// Configuration
beforeEach(function(done) {
  // Disable timeout for a hook
  this.timeout(0);

  // Remove all documents from todos collection
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(TODOS);
    })
    .then(() => done());
});

// Test suite
describe('POST /todos', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should create a new todo', done => {
    // Variables
    const text = 'Test todo text';

    // Assertions
    request(app)
      .post('/todos')
      .send({ text })
      .expect(201)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should not create todo with invalid body data', done => {
    // Assertions
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

// Test suite
describe('GET /todos', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
