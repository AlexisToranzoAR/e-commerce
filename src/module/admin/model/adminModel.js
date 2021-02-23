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
          validate: {
            len: {
              args: [1, 50],
              msg: 'Fullname between 1 to 50 chars',
            },
          },
        },
        username: {
          type: DataTypes.STRING,
          validate: {
            len: {
              args: [1, 50],
              msg: 'Username between 1 to 50 chars',
            },
          },
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
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
