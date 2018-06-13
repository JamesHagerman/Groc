const service = require('feathers-mongodb');

module.exports = function () {
  const app = this;
  const mongoClient = app.get('mongoClient');
  const dbTable = app.get('dbTable');
  let options = {};

  // This MUST happen before the promise below. Otherwise Feathers pins this
  // service to a notFound handler:
  app.use('/lists', service({}));

  //console.log(`MongoDB table: ${dbTable}`);
  mongoClient
    .then((client) => {
      let db = client.db(`${dbTable}`);
      console.log('Okay, MongoDB db returned', db);

      // Update the existing feathers-mongodb service with the Model:
      app.service('lists').Model = db.collection('lists');

      // Do something with that new service:
      //const service = app.service('lists');
    });
}
