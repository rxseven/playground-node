// Module dependencies
const expect = require('expect');
const { ObjectID } = require('mongodb');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/Todo');
const { User } = require('../models/User');

const { populateTodos, populateUsers, TODOS, USERS } = require('./seed/seed');

// Populate Todos
beforeEach(function(done) {
  // Disable timeout for a hook and populate seed data
  this.timeout(0);
  populateTodos(done);
});

// Popupate Users
beforeEach(function(done) {
  // Disable timeout for a hook and populate seed data
  this.timeout(0);
  populateUsers(done);
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
      .set('x-auth', USERS[0].tokens[0].token)
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
      .set('x-auth', USERS[0].tokens[0].token)
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
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
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
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(TODOS[0].text);
      })
      .end(done);
  });

  it('should not return todo document created by other user', done => {
    request(app)
      .get(`/todos/${TODOS[1]._id.toHexString()}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    // Generate random object ID
    const id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    // Generate invalid object ID
    const id = 'invalidId';

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', USERS[0].tokens[0].token)
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
      .set('x-auth', USERS[1].tokens[0].token)
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
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    // Generate invalid object ID
    const id = 'invalidId';

    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', USERS[1].tokens[0].token)
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

  it('should clear completeAt property when todo is not completed', done => {
    // Generate object ID from the initial todo item
    const id = TODOS[1]._id.toHexString();

    // Expected text string
    const text = 'Fix typo';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
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

// Test suite
describe('GET /users/me', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(USERS[0]._id.toHexString());
        expect(res.body.email).toBe(USERS[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({ message: 'Unauthorized' });
      })
      .end(done);
  });
});

// Test suite
describe('DELETE /users/me/token', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should remove JWT on logout', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});

// Test suite
describe('POST /users', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should create a user', done => {
    // Variables
    const email = 'montri@mail.com';
    const password = 'somepassword';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(201)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('should return validation errors if request invalid', done => {
    request(app)
      .post('/users')
      .send({
        email: 'invalidEmail.com',
        password: 'short'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({
        email: USERS[0].email,
        email: USERS[0].password
      })
      .expect(400)
      .end(done);
  });
});

// Test suite
describe('POST /users/login', function() {
  // Disable timeout for test suite
  this.timeout(0);

  it('should login user and return JWT', done => {
    request(app)
      .post('/users/login')
      .send({
        email: USERS[1].email,
        password: USERS[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(USERS[1]._id.toHexString());
        expect(res.body.email).toBe(USERS[1].email);
        expect(res.header['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[1]._id)
          .then(user => {
            expect(user.tokens[0]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(error => done(error));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: USERS[1].email,
        password: 'incorrectPassword'
      })
      .expect(401)
      .expect(res => {
        expect(res.body._id).not.toBe(USERS[1]._id.toHexString());
        expect(res.body.email).not.toBe(USERS[1].email);
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});
