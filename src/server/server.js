// Module dependencies
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');

// Create Express server
const app = express();

// Body parsing
app.use(bodyParser.json());

// Add todo
app.post('/todos', (req, res) => {
  // Create new document
  const todo = new Todo({
    text: req.body.text
  });

  // Save the document
  todo.save().then(
    document => {
      res.status(201).send(document);
    },
    error => {
      res.status(400).send(error);
    }
  );
});

// Get todos
app.get('/todos', (req, res) => {
  Todo.find().then(
    todos => {
      res.status(200).send({ todos });
    },
    error => {
      res.status(400).send(error);
    }
  );
});

// Get todo
app.get('/todos/:id', (req, res) => {
  // Variables
  const { id } = req.params;

  // Check invalid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ message: 'Invalid Todo ID' });
  }

  // Get todo by ID
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({ message: 'Todo not found' });
      }

      res.status(200).send({ todo });
    })
    .catch(error => {
      res.status(400).send({ message: 'Something went wrong' });
    });
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  // Variables
  const { id } = req.params;

  // Check invalid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ message: 'Invalid Todo ID' });
  }

  // Delete todo by ID
  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({ message: 'Todo not found' });
      }

      res.status(200).send({ todo });
    })
    .catch(error => {
      res.status(400).send({ message: 'Something went wrong' });
    });
});

// Update todo
app.patch('/todos/:id', (req, res) => {
  // Variables
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);

  // Check invalid ID
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({ message: 'Invalid Todo ID' });
  }

  // Update todo properties
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  // Save changes
  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send({ message: 'Todo not found' });
      }

      res.send({ todo });
    })
    .catch(error => {
      res.status(400).send({ message: 'Something went wrong' });
    });
});

// Bind and listen for connections on the specified host and port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is listening on port 5000');
});

// Module exports
module.exports = { app };
