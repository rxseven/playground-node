// Module dependencies
const expect = require('expect');
const { ObjectID } = require('mongodb');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');

const { populateTodos, TODOS } = require('./seed/seed');

// Configuration
beforeEach(function(done) {
  // Disable timeout for a hook
  this.timeout(0);

  // Populate Todos
  populateTodos(done);
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

// Test suite
describe('GET /todos/:id', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should return todo document', done => {
    request(app)
      .get(`/todos/${TODOS[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(TODOS[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    // Generate random object ID
    const id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    // Generate invalid object ID
    const id = 'invalidId';

    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

// Test suite
describe('DELETE /todos/:id', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should delete a todo', done => {
    // Generate object ID from the initial todo item
    const id = TODOS[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }

        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it('should return 404 if todo not found', done => {
    // Generate random object ID
    const id = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    // Generate invalid object ID
    const id = 'invalidId';

    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});

// Test suite
describe('PATCH /todos/:id', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should update a todo', done => {
    // Generate object ID from the initial todo item
    const id = TODOS[1]._id.toHexString();

    // Expected text string
    const text = 'Merge to master and deploy to the production server';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    // Generate random object ID
    const id = new ObjectID().toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    // Generate invalid object ID
    const id = 'invalidId';

    request(app)
      .patch(`/todos/${id}`)
      .expect(404)
      .end(done);
  });
});
