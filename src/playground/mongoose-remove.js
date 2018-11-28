// Module dependencies
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/Todo');

// Constants
const ID = '5bfe9e09eea6851e0e6cbe0f';

// Delete many
Todo.deleteMany({}).then(result => {
  console.log(result);
});

// Find one and delete
Todo.findOneAndDelete({ _id: ID }).then(todo => console.log(todo));

// Find by ID and delete
Todo.findByIdAndDelete(ID).then(todo => console.log(todo));
