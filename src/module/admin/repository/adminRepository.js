const AdminNotDefinedError = require('../error/AdminNotDefinedError');
const AdminIdNotDefinedError = require('../error/AdminIdNotDefinedError');
const AdminUsernameNotDefinedError = require('../error/AdminUsernameNotDefinedError');
const AdminNotFoundError = require('../error/AdminNotFoundError');
const { fromModelToEntity } = require('../mapper/adminMapper');
const Admin = require('../entity/Admin');

module.exports = class BrandRepository {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }

  async getAll() {
    const adminInstances = await this.adminModel.findAll({
      order: [['id', 'ASC']],
    });
    return adminInstances.map(fromModelToEntity);
  }

  async getById(adminId) {
    if (!Number(adminId)) {
      throw new AdminIdNotDefinedError();
    }
    const adminInstance = await this.adminModel.findByPk(adminId);
    if (!adminInstance) {
      throw new AdminNotFoundError(`There is no existing admin with ID ${adminId}`);
    }

    return fromModelToEntity(adminInstance);
  }

  async getByUsername(username) {
    if (!String(username)) {
      throw new AdminUsernameNotDefinedError();
    }
    const adminInstance = await this.adminModel.findOne({
      where: { username: username },
    });
    if (!adminInstance) {
      throw new AdminNotFoundError(`There is no existing admin with username ${username}`);
    }

    return fromModelToEntity(adminInstance);
  }

  async save(admin) {
    if (!(admin instanceof Admin)) {
      throw new AdminNotDefinedError();
    }

    let adminModel;
    const buildOptions = { isNewRecord: !admin.id };
    adminModel = this.adminModel.build(admin, buildOptions);
    adminModel = await adminModel.save();

    return fromModelToEntity(adminModel);
  }

  async delete(admin) {
    if (!admin || !admin.id) {
      throw new AdminIdNotDefinedError();
    }

    return Boolean(await this.adminModel.destroy({ where: { id: admin.id } }));
  }
};
