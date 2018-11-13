// Module dependencies
const config = require('config');
const { MongoClient } = require('mongodb');

// Create a database connection
MongoClient.connect(config.mongoDB.URI, { useNewUrlParser: true }, (error, client) => {
  // Verify a connection
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // Define a database
  const db = client.db(config.mongoDB.name);

  // Insert todo to Todos collection
  db.collection('Todos').insertOne({
    text: 'Call John',
    completed: true
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert todo', error);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log('Timestamp:', result.ops[0]._id.getTimestamp());
  });

  // Insert user to Users collection
  db.collection('Users').insertOne({
    name: 'Andrew',
    age: 25,
    location: 'Philadephia'
  }, (error, result) => {
    if (error) {
      return console.log('Unable to insert user', error);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log('Timestamp:', result.ops[0]._id.getTimestamp());
  });

  // Close a connection
  client.close();
});
