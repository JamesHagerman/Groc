
module.exports = function (app) {
  const myService = {
    async find(params) {
      return [];
    },
    async get(id, params) {},
    async create(data, params) {},
    async update(id, data, params) {},
    async patch(id, data, params) {},
    async remove(id, params) {},
    setup(app, path) {}
  }
  
  app.use('/state', myService);

}
