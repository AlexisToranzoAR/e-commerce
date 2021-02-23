const bcrypt = require('bcrypt');
const Admin = require('../entity/Admin');

async function hashPassword(password) {
  const costFactor = 10;
  return bcrypt.hash(password, costFactor).then((hash) => hash);
}

async function fromDataToEntity({ id, 'full-name': fullName, username, password, role }) {
  const admin = new Admin({
    id,
    fullName,
    username,
    password,
    role,
  });
  await admin.hashPassword();
  return admin;
}

function fromModelToEntity(model) {
  return new Admin(model.toJSON());
}

module.exports = {
  fromDataToEntity,
  fromModelToEntity,
};
