const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize } = require('../../middlewares/auth');
const {
  user,
} = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} /api/v1/user Create
   * @apiDescription Create user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission any
   *
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized    Only superuser can access
   */
  .post(validate(user), controller.create);

module.exports = router;
