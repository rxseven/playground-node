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

  // Update one todo from many in Todos collection
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5beac24d85a7cd1e05252a60')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log('Updated todo:');
    console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('Unable to update todo', error);
  });

  // Update one user from many in Users collection
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5beac5e5558f941e82abc68a')
  }, {
    $set: {
      name: 'Ting Tong'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log('Updated todo:');
    console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('Unable to update todo', error);
  });

  // Close a connection
  client.close();
});
