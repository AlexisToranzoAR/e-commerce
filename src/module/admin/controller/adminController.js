const { fromDataToEntity } = require('../mapper/adminMapper');

module.exports = class AdminController {
  constructor(adminService) {
    this.ROUTE_BASE = '/admin';
    this.VIEWS_DIR = 'admin/views';
    this.adminService = adminService;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/`, this.dashboard.bind(this));
    app.get(`${ROUTE}/administrators`, this.index.bind(this));
    app.get(`${ROUTE}/administrators/create`, this.create.bind(this));
    app.post(`${ROUTE}/administrators/save`, this.save.bind(this));
  }

  async dashboard(req, res) {
    res.render(`${this.VIEWS_DIR}/dashboard.html`);
  }

  async index(req, res) {
    const admins = await this.adminService.getAll();
    const { errors, messages } = req.session;

    res.render(`${this.VIEWS_DIR}/index.html`, {
      admins,
      messages,
      errors,
    });
    req.session.errors = [];
    req.session.messages = [];
  }

  async create(req, res) {
    res.render(`${this.VIEWS_DIR}/create.html`);
  }

  async save(req, res) {
    try {
      const admin = await fromDataToEntity(req.body);
      const savedAdmin = await this.adminService.save(admin);
      if (admin.id) {
        req.session.messages = [
          `The admin ${savedAdmin.fullName} was updated correctly (ID: ${savedAdmin.id})`,
        ];
      } else {
        req.session.messages = [
          `The brand ${savedAdmin.fullName} was created correctly (ID: ${savedAdmin.id})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }
};
