require('dotenv').config();
const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//modules declaration

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

function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureSequelizeDatabase),
    Session: factory(configureSession),
    Multer: factory(configureMulter),
  });
}

// configure models

// add modules definitions

// setup associations

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  return container;
};
