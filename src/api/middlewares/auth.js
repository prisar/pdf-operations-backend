const httpStatus = require('http-status');
const passport = require('passport');
const { intersection, map } = require('lodash');
const User = require('../models/user.model');
const APIError = require('../utils/APIError');

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  req.logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !user) throw error;
    await req.logIn(user, {
      session: false,
    });
  } catch (e) {
    return next(apiError);
  }

  if (intersection(roles, map(user.roles, role => role.name)).length === 0) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.authorize = (roles = User.roles) => (req, res, next) => {
  passport.authenticate(
    'jwt', {
      session: false,
    },
    handleJWT(req, res, next, roles),
  )(req, res, next);
};
