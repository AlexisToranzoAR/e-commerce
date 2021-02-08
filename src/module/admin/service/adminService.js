const AdminIdNotDefinedError = require('../error/AdminIdNotDefinedError');
const AdminUsernameNotDefinedError = require('../error/AdminUsernameNotDefinedError');
const AdminNotDefinedError = require('../error/AdminNotDefinedError');
const Admin = require('../entity/Admin');

module.exports = class AdminService {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAll() {
    return this.adminRepository.getAll();
  }

  async getById(adminId) {
    if (!Number(adminId)) {
      throw new AdminIdNotDefinedError();
    }
    return this.adminRepository.getById(adminId);
  }

  async getByUsername(username) {
    if (!String(username)) {
      throw new AdminUsernameNotDefinedError();
    }
    return this.adminRepository.getByUsername(username);
  }

  async save(admin) {
    if (!(admin instanceof Admin)) {
      throw new AdminNotDefinedError();
    }
    return this.adminRepository.save(admin);
  }

  async delete(admin) {
    if (!(admin instanceof Admin)) {
      throw new AdminNotDefinedError();
    }
    return this.adminRepository.delete(admin);
  }
};
