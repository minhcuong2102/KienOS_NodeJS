const { DataTypes, Model } = require('sequelize');

class PtService extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        discount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        session_duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cost_per_session: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        validity_period: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
      },
      {
        tableName: 'pt_service',
        modelName: 'PtService',
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

module.exports = PtService;
