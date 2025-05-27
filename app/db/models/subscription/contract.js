const { DataTypes, Model } = require("sequelize");

class Contract extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        expire_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        nonptservice_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        ptservice_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        coach_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        customer_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        is_purchased: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        used_sessions: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        number_of_session: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 99
        }
      },
      {
        tableName: "contract",
        modelName: "contract",
        sequelize,
        timestamps: false, // Assuming you don't need createdAt and updatedAt
        ...opts,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.CoachProfile, {
      as: "coach", // Alias for coach association
      foreignKey: "coach_id",
      //deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED, // Foreign key deferrable constraint
    });
    
    this.belongsTo(models.CustomerProfile, {
      as: "customer", // Alias for customer association
      foreignKey: "customer_id",
      //deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED, // Foreign key deferrable constraint
    });

    this.belongsTo(models.NonPtService, {
      as: "nonPtService", // Alias for non-pt service association
      foreignKey: "nonptservice_id",
      //deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED, // Foreign key deferrable constraint
    });

    this.belongsTo(models.PtService, {
      as: "ptService", // Alias for pt service association
      foreignKey: "ptservice_id",
      //deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED, // Foreign key deferrable constraint
    });
  }
}

module.exports = Contract;
