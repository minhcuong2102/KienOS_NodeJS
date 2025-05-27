const { DataTypes, Model } = require('sequelize');

class Role extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        permissions: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        tableName: 'role',
        modelName: 'Role',
        sequelize,
        timestamps: false,
        ...opts,
      }
    );
  }

  static associate(models) {
    // Define associations here if needed in the future
  }
}

module.exports = Role;
