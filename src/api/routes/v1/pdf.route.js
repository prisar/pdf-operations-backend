const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/pdf.controller');
const {
  upload,
} = require('../../validations/pdf.validation');

const router = express.Router();

router
  .route('/upload')
  /**
   * @api {post} api/v1/pdf/upload Upload
   * @apiDescription Upload a pdf
   * @apiVersion 1.0.0
   * @apiName Upload
   * @apiGroup Pdf
   * @apiPermission public
   *
   * @apiParam  {String}         file  User's pdf
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Incorrect username or password
   */
  .post(validate(upload), controller.upload);

module.exports = router;
