const Joi = require('joi');

module.exports = {
  // POST /api/v1/pdf/upload
  upload: {
  },
  download: {
    query: {
      file: Joi.string().required(),
    }
  },
  merge: {
    body: {
      firstPdf: Joi.string().required(),
      secondPdf: Joi.string().required()
    }
  },
  split: {
    body: {
      pdfFile: Joi.string().required(),
      pages: Joi.array(),
      pageRanges: Joi.array()
    }
  },
  deletePages: {
    body: {
      pdfFile: Joi.string().required(),
      pages: Joi.array(),
      pageRanges: Joi.array()
    }
  },
  reorder: {
    body: {
      pdfFile: Joi.string().required(),
      pageIdexes: Joi.array()
    }
  }
};
