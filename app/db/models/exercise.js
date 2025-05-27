const { DataTypes, Model } = require("sequelize");

class Exercise extends Model {
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
            duration: {
              type: DataTypes.INTEGER,
              allowNull: false,
            },
            repetitions: {
              type: DataTypes.STRING(256),
              allowNull: false,
            },
            image_url: {
              type: DataTypes.STRING(100),
              allowNull: false,
            },
            embedded_video_url: {
              type: DataTypes.TEXT,
              allowNull: false,
            }
          },
          {
            tableName: "exercise",
            modelName: "Exercise",
            sequelize,
            timestamps: false,
            ...opts,
          }
        );
      }
    
    //   static associate(models) {
    //     // Define associations here if needed
    //     this.belongsTo(models.User, {
    //       foreignKey: "coach_id_id",
    //       as: "coach",
    //     });
    //     this.belongsTo(models.User, {
    //       foreignKey: "customer_id_id",
    //       as: "customer",
    //     });
    //   }
}

module.exports = Exercise;