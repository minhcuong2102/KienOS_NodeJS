// eslint-disable-next-line max-classes-per-file
const { isArray } = require('lodash/isArray');

const HTTP_ERROR = Object.freeze({
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  TIME_OUT: 402,
  BAD_REQUEST: 400,
  NOT_AUTHENTICATE: 401,
  NOT_ACCEPTABLE: 406,
  INTERNAL_SERVER_ERROR: 500
});

const SYSTEM_ERROR = Object.freeze(["EACCES", "EPERM"]);

function isSystemError(err) {
  return err && err.code && SYSTEM_ERROR.indexOf(err.code) >= 0;
}

class HttpError extends Error {
  constructor(code, message, info) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.info = info;
  }
}

class FieldError {
  constructor(name, code, message) {
    this.name = name;
    this.code = code;
    this.message = message;
  }
}

class FormError extends HttpError {
  constructor(_errors) {
    let errors;
    let message;
    if (isArray(_errors)) {
      errors = _errors;
      message = _errors[0].message;
    } else {
      errors = [_errors];
      message = _errors.message;
    }
    // console.log(message)
    const encodeMessage = encodeURIComponent(message);
    super(HTTP_ERROR.BAD_REQUEST, encodeMessage);
    this.errors = errors;
  }
}

function badRequest(name, code, message) {
  return new FormError(new FieldError(name, code, message));
}

function notFoundRequest(name, code, message) {
  return new FormError(new FieldError(name, code, message));
}

module.exports = {
  HTTP_ERROR,
  isSystemError,
  HttpError,
  FieldError,
  FormError,
  badRequest,
  notFoundRequest
};