const initPtServiceController = require("./ptservice.controller");
const initNonPtServiceController = require("./non-ptservice.controller");

const initSubscriptionController = (app) => {
  initPtServiceController(app);
  initNonPtServiceController(app);
};

module.exports = {
    initSubscriptionController
};