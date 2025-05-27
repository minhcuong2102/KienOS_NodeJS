
const initChatController = require('./chat.controller');
const { initSubscriptionController } = require('./subscription');

const initApiController = (app) => {
    initSubscriptionController(app);
    initChatController(app);
}

module.exports = initApiController;