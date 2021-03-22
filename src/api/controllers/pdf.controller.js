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
      if (err) return res.json({ code: httpStatus.BAD_REQUEST, message: "err", file: pdfFile.name });

      return res.json({ code: httpStatus.OK, message: "Pdf uploaded successfully", file: pdfFile.name });
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * download pdf
 * @public
 */
 exports.download = async (req, res, next) => {
  try {
    const fileName = req.query.file;
    const file = `${__basedir}/files/${fileName}`;
    // TODO: check if file exists
    return res.download(file);
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
    // TODO: check if files exists
    const outputfile = await AdobeService.merge(firstPdf, secondPdf);
    return res.json({ code: httpStatus.OK, message: "Pdf merged successfully", file: outputfile });
  } catch (error) {
    return next(error);
  }
};

/**
 * split pdf
 * @public
 */
 exports.split = async (req, res, next) => {
  try {
    const { pdfFile } = { ...req.body };
    const { pages } = { ...req.body };
    const { pageRanges } = { ...req.body };
    const outputfiles = await AdobeService.split(pdfFile, pages, pageRanges);
    return res.json({ code: httpStatus.OK, message: "Pdf splited successfully", files: `outputfiles` });
  } catch (error) {
    return next(error);
  }
};

/**
 * delete pages
 * @public
 */
 exports.delete = async (req, res, next) => {
  try {
    const { pdfFile } = { ...req.body };
    const { pages } = { ...req.body };
    const { pageRanges } = { ...req.body };
    const outputfile = await AdobeService.delete(pdfFile, pages, pageRanges);
    return res.json({ code: httpStatus.OK, message: "Pdf pages deleted successfully", file: outputfile });
  } catch (error) {
    return next(error);
  }
};

/**
 * reorder pages
 * @public
 */
 exports.reorder = async (req, res, next) => {
  try {
    const { pdfFile } = { ...req.body };
    const { pageIndexes } = { ...req.body };
    const outputfile = await AdobeService.reorder(pdfFile, pageIndexes);
    return res.json({ code: httpStatus.OK, message: "Pdf pages reordered successfully", file: `outputfile` });
  } catch (error) {
    return next(error);
  }
};