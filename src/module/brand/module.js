const BrandController = require('./controller/brandController');
const BrandService = require('./service/brandService');
const BrandRepository = require('./repository/brandRepository');
const BrandModel = require('./model/brandModel');

function initBrandModule(app, container) {
  const controller = container.get('BrandController');
  controller.configureRoutes(app);
}

module.exports = {
  BrandController,
  BrandService,
  BrandRepository,
  BrandModel,
  initBrandModule,
};
