const { DataTypes, Model } = require("sequelize");

class NonPtService extends Model {
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
        number_of_month: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cost_per_month: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
      },
      {
        tableName: "nonpt_service",
        modelName: "NonPtService",
        sequelize,
        timestamps: false,
        ...opts,
      }
    );
  }

  static associate(models) {
    // Define associations here if needed
  }
}

module.exports = NonPtService;