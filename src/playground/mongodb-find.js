// Module dependencies
const config = require('config');
const { ObjectID, MongoClient } = require('mongodb');

// Create a database connection
MongoClient.connect(config.mongoDB.URI, { useNewUrlParser: true }, (error, client) => {
  // Verify a connection
  if (error) {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  // Define a database
  const db = client.db(config.mongoDB.name);

  // Find all todos in Todos collection
  db.collection('Todos').find().toArray().then((docs) => {
    console.log('All todos:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('Unable to fetch todos', error);
  });

  // Find uncompleted todos in Todos collection
  db.collection('Todos').find({ completed: false }).toArray().then((docs) => {
    console.log('Uncompleted todos:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('Unable to fetch todos', error);
  });

  // Find a specific todo in Todos collection
  db.collection('Todos').find({
    _id: new ObjectID('5beac27aaa78381e12e64e47')
  }).toArray().then((docs) => {
    console.log('A todo where its ID is 5beac27aaa78381e12e64e47:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('Unable to fetch todo', error);
  });

  // Count all todos in Todos collection
  db.collection('Todos').find().count().then((count) => {
    console.log(`All todos: ${count}`);
  }, (error) => {
    console.log('Unable to count todos', error);
  });

  // Find users in Users collection
  db.collection('Users').find({ name: 'Andrew' }).toArray().then((docs) => {
    console.log('Users where their name are Andrew:');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (error) => {
    console.log('Unable to fetch users', error);
  });

  // Close a connection
  client.close();
});
