const { DataTypes, Model } = require("sequelize");

class Message extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        sent_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        is_ai: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        extra_data: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        coach_id_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
        },
        customer_id_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
        },
      },
      {
        tableName: "message",
        modelName: "Message",
        sequelize,
        timestamps: false,
        ...opts,
      }
    );
  }

  static associate(models) {
    // Define associations here if needed
    this.belongsTo(models.User, {
      foreignKey: "coach_id_id",
      as: "coach",
    });
    this.belongsTo(models.User, {
      foreignKey: "customer_id_id",
      as: "customer",
    });
  }
}

module.exports = Message;
