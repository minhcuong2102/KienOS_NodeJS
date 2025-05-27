const PtService = require('./ptservice');
const NonPtService = require('./non-ptservice');
const Contract = require('./contract');

const initAllSubscriptionModel = (sequelize) => ({
  PtService: PtService.init(sequelize),
  NonPtService: NonPtService.init(sequelize),
  Contract: Contract.init(sequelize),
});

module.exports = {
  initAllSubscriptionModel
};