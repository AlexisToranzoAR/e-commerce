module.exports = class brandController {
  constructor(brandService, uploadMiddleware) {
    this.ROUTE_BASE = '/admin/brand';
    this.VIEWS_DIR = 'brand/views';
    this.brandService = brandService;
    this.uploadMiddleware = uploadMiddleware;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${ROUTE}/`, this.index.bind(this));
    /* app.get(`${ROUTE}/create`, this.create.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.post(`${ROUTE}/save`, this.uploadMiddleware.single('image'), this.save.bind(this)); */
  }

  async index(req, res) {
    const brands = this.brandService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.VIEWS_DIR}/index.njk`, { brands, messages, errors });
    req.session.errors = [];
    req.session.messages = [];
  }
};
