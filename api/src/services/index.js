const lists = require('./lists/lists.service.js');
module.exports = function () {
  const app = this;
  app.configure(lists);
};
