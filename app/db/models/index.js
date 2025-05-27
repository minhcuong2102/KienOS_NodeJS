const Sequelize = require('sequelize');
const databaseConfig = require('../../config/database');

const {initAllSubscriptionModel} = require('./subscription');
const {initAllUserModel} = require('./user');
const Role = require('./role');
const { initAllWorkoutModel } = require('./workout');
const Message = require('./message');
const Exercise = require('./exercise');

const env = process.env.NODE_ENV || "development";

const config = {
  ...databaseConfig[env]
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = {

  ...initAllSubscriptionModel(sequelize),

  ...initAllUserModel(sequelize),

  ...initAllWorkoutModel(sequelize),

  Role: Role.init(sequelize),

  Message: Message.init(sequelize),
  Exercise: Exercise.init(sequelize),

};

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
