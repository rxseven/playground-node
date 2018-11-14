// Module dependencies
const express = require('express');
const bodyParser = require('body-parser');

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
  todo.save().then((document) => {
    res
      .status(201)
      .send(document);
  }, (error) => {
    res
      .status(400)
      .send(error);
  })
});

// Bind and listen for connections on the specified host and port
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is listening on port 5000');
});

// Module exports
module.exports = { app };