const AdminController = require('./controller/adminController');
const AdminService = require('./service/adminService');
const AdminRepository = require('./repository/adminRepository');
const AdminModel = require('./model/adminModel');
const Admin = require('./entity/Admin');

async function initAdminModule(app, container) {
  const controller = container.get('AdminController');
  controller.configureRoutes(app);
}

module.exports = {
  AdminController,
  AdminService,
  AdminRepository,
  AdminModel,
  initAdminModule,
};
