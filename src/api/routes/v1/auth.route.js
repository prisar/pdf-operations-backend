const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const { authorize } = require('../../middlewares/auth');
const {
  login,
  resetPassword,
} = require('../../validations/auth.validation');

const router = express.Router();

router
  .route('/login')
  /**
   * @api {post} api/v1/auth/login Login
   * @apiDescription Get an accessToken
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}         username  User's email
   * @apiParam  {String{..128}}  password  User's password
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Incorrect username or password
   */
  .post(validate(login), controller.login);

router
  .route('/resetpassword')
  /**
   * @api {put} api/v1/auth/resetpassword Reset Password
   * @apiDescription Reset password
   * @apiVersion 1.0.0
   * @apiName Login
   * @apiGroup Auth
   * @apiPermission superuser
   *
   * @apiParam  {String}         username  User's email
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized    Only superuser can reset password
   */
  .put(validate(resetPassword), controller.resetPassword);

module.exports = router;
