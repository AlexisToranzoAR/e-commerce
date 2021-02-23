const { fromDataToEntity } = require('../mapper/adminMapper');
const {
  existSuperAdmin,
  existNotSuperAdmin,
  verifyToken,
  isSuperAdmin,
} = require('../../../middleware/authJwt');

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
    app.get(`${ROUTE}/login`, existSuperAdmin, this.loginForm.bind(this));
    app.get(`${ROUTE}/logout`, this.logout.bind(this));
    app.get(`${ROUTE}/administrators`, verifyToken, this.index.bind(this));
    app.get(`${ROUTE}/administrators/create`, this.create.bind(this));
    app.get(`${ROUTE}/administrator/:id/edit`, [verifyToken, isSuperAdmin], this.edit.bind(this));
    app.get(
      `${ROUTE}/administrator/:id/delete`,
      [verifyToken, isSuperAdmin],
      this.delete.bind(this)
    );
    app.post(`${ROUTE}/login`, this.login.bind(this));
    app.post(`${ROUTE}/administrators/create`, this.save.bind(this));
    app.post(`${ROUTE}/create/first-admin`, existNotSuperAdmin, this.save.bind(this));
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
        return res
          .status(401)
          .send({ auth: false, token: null, message: "The password isn't correct" });
      }
      const token = this.jwt.sign({ id: admin.id, role: admin.role }, process.env.TOKEN_SECRET, {
        expiresIn: 604800000,
      });
      req.session.token = token;
      res.status(200).send({ auth: true, token, message: 'The login is successful' });
      /* res.json({
        auth: true,
        token,
      }); */
    } catch (e) {
      console.log(e);
      return res.status(404).send("The username doesn't exists");
    }
  }

  async logout(req, res) {
    req.session.token = null;
    res.redirect(`${this.ROUTE_BASE}/login`);
  }

  async index(req, res) {
    const admin = await this.adminService.getById(req.adminId);
    const admins = await this.adminService.getAll();
    const { errors, messages } = req.session;

    res.render(`${this.VIEWS_DIR}/index.html`, {
      admin,
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
      const token = this.jwt.sign(
        { id: savedAdmin.id, role: savedAdmin.role },
        process.env.TOKEN_SECRET,
        {
          expiresIn: 604800000,
        }
      );
      req.session.token = token;
      if (admin.id) {
        res.json({
          auth: true,
          token,
          message: `The admin ${savedAdmin.fullName} was updated`,
        });
      } else {
        res.status(201).json({
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
