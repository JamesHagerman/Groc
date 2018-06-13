const MongoClient = require('mongodb').MongoClient;

module.exports = function () {
  const app = this; // Remember, services are callbacks, "this" = the app

  // Fetch mongodb configs from config file:

  const dbHost = app.get('dbHost');
  const dbPort = app.get('dbPort');
  // const config = "mongodb://mongo:27017/zendb";
  // const config = app.get('mongodb');
  const config = `mongodb://${dbHost}:${dbPort}`;

  // Build a mongo client using the loaded config:
  console.log('MongoDB config: ', config);
  let client = MongoClient.connect(config)
  app.set('mongoClient', client);
};

