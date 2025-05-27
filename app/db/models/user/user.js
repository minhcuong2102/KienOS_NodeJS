const { DataTypes, Model } = require("sequelize");

class User extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        avatar_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        role_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        is_staff: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        is_superuser: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(255),
          allowNull: true,
        }
      },
      {
        tableName: "user",
        modelName: "User",
        sequelize,
        timestamps: false,
        ...opts,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Role, {
      as: "role", // You can name the association 'role'
      foreignKey: "role_id",
    });
  }
}

module.exports = User;