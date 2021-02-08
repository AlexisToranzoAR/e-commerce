const { fromDataToEntity } = require('../mapper/adminMapper');
const verifyToken = require('../../middleware/verifyToken');

module.exports = class AdminController {
  constructor(adminService, uploadMiddleware, jsonWebToken) {
    this.ROUTE_BASE = '/admin';
    this.VIEWS_DIR = 'admin/views';
    this.adminService = adminService;
    this.uploadMiddleware = uploadMiddleware;
    this.jwt = jsonWebToken;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/`, verifyToken, this.dashboard.bind(this));
    app.get(`${ROUTE}/login`, this.loginForm.bind(this));
    app.post(`${ROUTE}/login`, this.login.bind(this));
    //app.get(`${ROUTE}/logout`, this.logout.bind(this));
    app.get(`${ROUTE}/administrators`, this.index.bind(this));
    app.get(`${ROUTE}/administrators/create`, this.create.bind(this));
    app.post(`${ROUTE}/administrators/save`, this.save.bind(this));
    app.get(`${ROUTE}/administrator/:id/edit`, this.edit.bind(this));
    app.get(`${ROUTE}/administrator/:id/delete`, this.delete.bind(this));
  }

  async dashboard(req, res) {
    res.render(`${this.VIEWS_DIR}/dashboard.html`);
  }

  async loginForm(req, res) {
    res.render(`${this.VIEWS_DIR}/login.html`);
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await this.adminService.getByUsername(username);
      const validPassword = await admin.comparePassword(password);
      if (!validPassword) {
        return res.status(401).send({ auth: false, token: null });
      }
      const token = this.jwt.sign({ id: admin.id }, process.env.TOKEN_SECRET, {
        expiresIn: 604800000,
      });
      res.json({
        auth: true,
        token,
      });
    } catch (e) {
      res.status(404).send("The username doesn't exists");
    }
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
      const token = this.jwt.sign({ id: savedAdmin.id }, process.env.TOKEN_SECRET, {
        expiresIn: 604800000,
      });
      if (admin.id) {
        res.json({
          auth: true,
          token,
          message: `The admin ${savedAdmin.fullName} was updated`,
        });
      } else {
        res.json({
          auth: true,
          token,
          message: `The admin ${savedAdmin.fullName} was created`,
        });
      }
    } catch (e) {
      res.status(400).send('Something broke!');
    }
  }

  async edit(req, res) {
    const { id } = req.params;
    const admin = await this.adminService.getById(id);
    res.render(`${this.VIEWS_DIR}/edit.html`, {
      admin,
    });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const admin = await this.adminService.getById(id);
      await this.adminService.delete(admin);
      res.status(200).send(`The admin ${admin.fullName} has been deleted.`);
    } catch (e) {
      res.status(400).send('Something broke!');
    }
  }
};
