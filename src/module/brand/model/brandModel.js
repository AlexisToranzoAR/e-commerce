const { Model, DataTypes } = require('sequelize');

module.exports = class BrandModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof BrandModel}
   */
  static setup(sequelizeInstance) {
    BrandModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.BLOB,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Brand',
        tableName: 'brands',
        underscored: true,
        paranoid: true,
      }
    );
    return BrandModel;
  }
};
