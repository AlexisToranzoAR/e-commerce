require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

const configureDI = require('./config/di');
const { initAdminModule } = require('./module/admin/module');
const { initBrandModule } = require('./module/brand/module');

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));

nunjucks.configure('src/module', {
  autoescape: true,
  express: app,
});

const container = configureDI();
app.use(container.get('Session'));

initAdminModule(app, container);
//initBrandModule(app, container);

const mainDb = container.get('Sequelize');
mainDb.sync();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/admin`);
});
