const Joi = require('joi');

module.exports = {
  // POST /api/v1/user
  user: {
    body: {
      firstname: Joi.string().required(),
      lastname: Joi.string(),
      phone: Joi.string().length(10).required(),
      role: Joi.object().keys({
        id: Joi.number().positive().required(),
        name: Joi.string().required(),
      }).required(),
    },
  },
};
