const { DataTypes, Model } = require('sequelize');

class CoachProfile extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        first_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        last_name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        gender: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        birthday: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        height: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        weight: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        extra_data: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        coach_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: true,
        },
      },
      {
        tableName: 'coach_profile',
        modelName: 'CoachProfile',
        sequelize,
        timestamps: false, // Assuming no createdAt/updatedAt fields
        ...opts,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      as: 'coach',
      foreignKey: 'coach_id',
    });
  }
}

module.exports = CoachProfile;
