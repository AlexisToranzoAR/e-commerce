const bcrypt = require('bcrypt');

module.exports = class Admin {
  /**
   * @param {number} id
   * @param {string} fullName
   * @param {string} username
   * @param {string} password
   * @param {boolean} role
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, fullName, username, password, role, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.fullName = fullName;
    this.username = username;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt || undefined;
    this.formattedDates = this.formatDate();
  }

  formatDate() {
    const [createdAt, updatedAt, deletedAt] = [this.createdAt, this.updatedAt, this.deletedAt].map(
      (date) =>
        new Date(date).toLocaleString(false, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
    );
    return { createdAt, updatedAt, deletedAt };
  }

  async hashPassword() {
    const costFactor = 10;
    return bcrypt.hash(this.password, costFactor).then((hash) => {
      this.password = hash;
    });
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
};
