const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/pdf.controller');
const { authorize } = require('../../middlewares/auth');
const {
  login,
  resetPassword,
} = require('../../validations/auth.validation');

const router = express.Router();

router
  .route('/upload')
  /**
   * @api {post} api/v1/pdf/upload Login
   * @apiDescription Get an accessToken
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}         file  User's pdf
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Incorrect username or password
   */
  .post(controller.upload);

module.exports = router;
