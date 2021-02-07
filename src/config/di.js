require('dotenv').config();
const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const jsonWebToken = require('jsonwebtoken');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const {
  AdminController,
  AdminService,
  AdminRepository,
  AdminModel,
} = require('../module/admin/module');

const {
  BrandController,
  BrandService,
  BrandRepository,
  BrandModel,
} = require('../module/brand/module');

function configureSequelizeDatabase() {
  if (process.env.NODE_ENV === 'development') {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
  }
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

function configureSession(container) {
  const ONE_WEEK_IN_SECONDS = 604800000;

  const sequelize = container.get('Sequelize');
  const sessionOptions = {
    store: new SequelizeStore({ db: sequelize }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  };
  return session(sessionOptions);
}

function configureMulter() {
  const buffer = multer.memoryStorage({});
  return multer({ buffer });
}

function configureBrandModule(container) {
  return BrandModel.setup(container.get('Sequelize'));
}

function configureAdminModule(container) {
  return AdminModel.setup(container.get('Sequelize'));
}

// configure models

function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureSequelizeDatabase),
    Session: factory(configureSession),
    Multer: factory(configureMulter),
    JsonWebToken: jsonWebToken,
  });
}

function addBrandModuleDefinitions(container) {
  container.addDefinitions({
    BrandController: object(BrandController).construct(get('BrandService'), get('Multer')),
    BrandService: object(BrandService).construct(get('BrandRepository')),
    BrandRepository: object(BrandRepository).construct(get('BrandModel')),
    BrandModel: factory(configureBrandModule),
  });
}

function addAdminModuleDefinitions(container) {
  container.addDefinitions({
    AdminController: object(AdminController).construct(
      get('AdminService'),
      get('Multer'),
      get('JsonWebToken')
    ),
    AdminService: object(AdminService).construct(get('AdminRepository')),
    AdminRepository: object(AdminRepository).construct(get('AdminModel')),
    AdminModel: factory(configureAdminModule),
  });
}

// setup associations

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addAdminModuleDefinitions(container);
  addBrandModuleDefinitions(container);
  return container;
};
