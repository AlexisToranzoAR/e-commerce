module.exports = class Admin {
  /**
   * @param {number} id
   * @param {string} fullName
   * @param {string} username
   * @param {string} password
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, fullName, username, password, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.fullName = fullName;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
