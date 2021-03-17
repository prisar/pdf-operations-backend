const httpStatus = require("http-status");
const AdobeService = require("../services/adobe.service");

/**
 * Upload pdf
 * @public
 */
exports.upload = async (req, res, next) => {
  try {
    let pdfFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    pdfFile = req.files.pdfFile;
    uploadPath = __basedir + "/files/" + pdfFile.name;

    pdfFile.mv(uploadPath, function (err) {
      if (err) return res.json({ code: httpStatus.OK, message: "err", file: "filename" });

      return res.json({ code: httpStatus.OK, message: "Pdf uploaded successfully", file: pdfFile.name });
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * merge two pdf
 * @public
 */
exports.merge = async (req, res, next) => {
  try {
    const firstPdf = req.body.firstPdf;
    const secondPdf = req.body.secondPdf;
    const outputfile = await AdobeService.merge(firstPdf, secondPdf);
    return res.json({ code: httpStatus.OK, message: "Pdf merged successfully", file: outputfile });
  } catch (error) {
    return next(error);
  }
};
