const {FormError, HttpError, isSystemError} = require('../config/error');

const handleGlobalError = (app) => {

  app.use((err, req, res, next) => {
    if (err instanceof FormError) {
      res.statusMessage = err.message;
      res.status(err.code || 400).json(err.errors);
    } else if (err instanceof HttpError) {
      res.status(err.code).json({error: err.message});
    } else if (!isSystemError(err)) {
      res.status(500).json({error: err.message});
    } else {
      res.statusMessage = "Unknown Error";
      res.status(400).json({error: err.message});
    }
  });
};

module.exports = handleGlobalError;