const jwt = require('jsonwebtoken');
const adminModel = require('../module/admin/model/adminModel');

async function existSuperAdmin(req, res, next) {
  const admin = await adminModel.findOne({
    where: { role: 'superadmin' },
  });
  if (!admin) {
    return res.render(`admin/views/register.html`);
  }
  return next();
}

async function existNotSuperAdmin(req, res, next) {
  const admin = await adminModel.findOne({
    where: { role: 'superadmin' },
  });
  if (!admin) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

async function verifyToken(req, res, next) {
  const { token } = req.session;
  //const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({
      auth: false,
      message: 'No token provided',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.adminId = decoded.id;
    const admin = await adminModel.findByPk(req.adminId);
    if (!admin) {
      return res.status(404).json({
        message: 'No admin found',
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

async function isSuperAdmin(req, res, next) {
  try {
    const admin = await adminModel.findByPk(req.adminId);

    if (admin.role === 'superAdmin') {
      next();
    }

    return res.status(403).json({ message: 'Require super admin Role!' });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

module.exports = {
  existSuperAdmin,
  existNotSuperAdmin,
  verifyToken,
  isSuperAdmin,
};
