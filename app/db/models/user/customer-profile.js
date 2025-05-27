const { DataTypes, Model } = require('sequelize');

class CustomerProfile extends Model {
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
        customer_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: true,
        },
        body_fat: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        height: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        muscle_mass: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        weight: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        workout_goal_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          unique: true,
        },
        health_condition: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        tableName: 'customer_profile',
        modelName: 'CustomerProfile',
        sequelize,
        timestamps: false, // Assuming no createdAt/updatedAt fields
        ...opts,
      }
    );
  }

  static associate(models) {
    
    this.belongsTo(models.WorkoutGoal, {
      as: 'workout_goal',
      foreignKey: 'workout_goal_id',
    });
    this.belongsTo(models.User, {
      as: 'customer',
      foreignKey: 'customer_id',
    });
  }
}

module.exports = CustomerProfile;
