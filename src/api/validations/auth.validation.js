const Joi = require('joi');

module.exports = {
  // POST /api/v1/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required().max(128),
    },
  },

  // PUT /api/v1/auth/resetpassword
  resetPassword: {
    body: {
      username: Joi.string().required(),
    },
  },
};
