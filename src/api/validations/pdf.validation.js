const Joi = require('joi');

module.exports = {
  // POST /api/v1/pdf/upload
  upload: {
  },
  merge: {
    body: {
      firstPdf: Joi.string().required(),
      secondPdf: Joi.string().required()
    }
  },
  download: {
    query: {
      file: Joi.string().required(),
    }
  }
};
