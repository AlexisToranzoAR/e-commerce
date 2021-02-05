module.exports = class Brand {
  /**
   * @param {number} id
   * @param {string} name
   * @param {ArrayBuffer} image
   * @param {string} createdAt
   * @param {string} updatedAt
   * @param {string} deletedAt
   */
  constructor({ id, name, image, createdAt, updatedAt, deletedAt }) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
};
