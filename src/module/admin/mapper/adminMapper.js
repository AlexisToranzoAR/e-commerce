const bcrypt = require('bcrypt');
const Admin = require('../entity/Admin');

async function hashPassword(password) {
  const costFactor = 10;
  return bcrypt.hash(password, costFactor).then((hash) => hash);
}

async function fromDataToEntity({ id, 'full-name': fullName, username, password }) {
  return new Admin({
    id,
    fullName,
    username,
    password: password ? await hashPassword(password) : undefined,
  });
}

function fromModelToEntity(model) {
  return new Admin(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
