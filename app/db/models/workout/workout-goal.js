const { DataTypes, Model } = require('sequelize');

class WorkoutGoal extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        weight: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        extra_data: {
          type: DataTypes.JSONB, // Use JSONB to match the SQL definition
          allowNull: true,
        },
        body_fat: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        muscle_mass: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        general: {
          type: DataTypes.STRING, // Use STRING to match the varchar type in SQL
          allowNull: true,
        },
      },
      {
        tableName: 'workout_goal',
        modelName: 'WorkoutGoal',
        sequelize,
        timestamps: false, // Assuming no createdAt/updatedAt fields
        ...opts,
      }
    );
  }

  static associate(models) {
    // Define associations here if needed
  }
}

module.exports = WorkoutGoal;