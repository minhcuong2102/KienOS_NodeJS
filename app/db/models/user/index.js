
const User = require('./user');
const CoachProfile = require('./coach-profile');
const CustomerProfile = require('./customer-profile');

const initAllUserModel = (sequelize) => ({
  User: User.init(sequelize),
  CoachProfile: CoachProfile.init(sequelize),
  CustomerProfile: CustomerProfile.init(sequelize),
});

module.exports = {
  initAllUserModel
};