const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/pdf.controller");
const { upload, download, merge, split } = require("../../validations/pdf.validation");

const router = express.Router();

router
  .route("/upload")
  /**
   * @api {post} api/v1/pdf/upload Upload
   * @apiDescription Upload a pdf
   * @apiVersion 1.0.0
   * @apiName Upload
   * @apiGroup Pdf
   * @apiPermission public
   *
   * @apiParam  {String}         file               User's pdf
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Incorrect username or password
   */
  .post(validate(upload), controller.upload);

router
  .route("/download")
  /**
   * @api {post} api/v1/pdf/download Download
   * @apiDescription Download pdf
   * @apiVersion 1.0.0
   * @apiName Download
   * @apiGroup Pdf
   * @apiPermission public
   *
   * @apiParam  {String}         file  Filename
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Invalid token
   */
  .get(validate(download), controller.download);

router
  .route("/merge")
  /**
   * @api {post} api/v1/pdf/merge Merge
   * @apiDescription Merge two pdf
   * @apiVersion 1.0.0
   * @apiName Merge
   * @apiGroup Pdf
   * @apiPermission public
   *
   * @apiParam  {String}         firstPdf  First pdf
   * @apiParam  {String}         secondPdf Second pdf
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Invalid token
   */
  .post(validate(merge), controller.merge);

router
  .route("/split")
  /**
   * @api {post} api/v1/pdf/split Split
   * @apiDescription Split pdf
   * @apiVersion 1.0.0
   * @apiName Split
   * @apiGroup Pdf
   * @apiPermission public
   *
   * @apiParam  {String}         pdfFile            Pdf File
   * @apiParam  {array}          pageRanges         page ranges
   *
   * @apiError (Bad Request 400)  ValidationError   Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized      Invalid token
   */
  .post(validate(split), controller.split);

module.exports = router;
