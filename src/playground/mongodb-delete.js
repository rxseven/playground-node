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

  // Delete many todos in Todos collection
  db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
    console.log('Deleted todos:');
    console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('Unable to delete todos', error);
  });

  // Delete a specific todo in Todos collection
  db.collection('Todos').deleteOne({ text: 'Call John' }).then((result) => {
    console.log('Deleted todo:');
    console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('Unable to delete todo', error);
  });

  // Delete one todo from many in Todos collection
  db.collection('Todos').findOneAndDelete({ text: 'Call John' }).then((result) => {
    console.log('Deleted todo:');
    console.log(JSON.stringify(result, undefined, 2));
  }, (error) => {
    console.log('Unable to delete todo', error);
  });

  // Close a connection
  client.close();
});
