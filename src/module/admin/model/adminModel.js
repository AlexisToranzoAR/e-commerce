const { Model, DataTypes } = require('sequelize');

module.exports = class AdminModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof AdminModel}
   */
  static setup(sequelizeInstance) {
    AdminModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        fullName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Admin',
        tableName: 'admins',
        underscored: true,
        paranoid: true,
      }
    );
    return AdminModel;
  }
};
