const createService = require('feathers-mongodb');

module.exports = function () {
  const app = this;
  const mongoClient = app.get('mongoClient');
  const dbTable = app.get('dbTable');
  let options = {};

  //console.log(`MongoDB table: ${dbTable}`);
  mongoClient
    .then((client) => {
      let db = client.db(`${dbTable}`);
      console.log('Okay, MongoDB db returned', db);

      options = Object.assign({}, options, {
        Model: db.collection('lists')
      });

      app.use('/lists', createService(options));

      // Do something with that new service:
      //const service = app.service('lists');
    });
}
