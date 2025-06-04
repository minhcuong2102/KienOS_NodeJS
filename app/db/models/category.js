const { Model, DataTypes } = require("sequelize");

class Category extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(256),
          allowNull: false,
        },
      },
      {
        tableName: "category",
        modelName: "Category",
        sequelize,
        timestamps: false,
        ...opts,
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.Exercise, {
      through: 'exercise_categories',
      foreignKey: 'category_id',
      otherKey: 'exercise_id',
      as: 'exercises',
    });
  }
}
module.exports = Category;
