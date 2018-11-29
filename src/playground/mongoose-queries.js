// Module dependencies
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');

// Constants
const ID = '5bfe88cef0d420123bb5a4ec';

// Find
Todo.find({
  _id: ID
}).then(todos => {
  console.log('Todos:', todos);
});

// Find one
Todo.findOne({
  _id: ID
}).then(todo => {
  console.log('Todo:', todo);
});

// Find by ID
Todo.findById('invalidID')
  .then(todo => {
    if (!todo) {
      return console.log('ID not found');
    }
    console.log('Todo:', todo);
  })
  .catch(error => console.log(error));
