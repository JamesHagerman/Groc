const lists = require('./lists/lists.service.js');
const stateService = require('./state/state.service.js');
module.exports = function () {
  const app = this;
  app.configure(lists);
  app.configure(stateService);
};
