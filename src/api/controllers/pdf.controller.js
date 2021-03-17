const httpStatus = require('http-status');

/**
 * Upload pdf
 * @public
 */
exports.upload = async (req, res, next) => {
  try {
    let pdfFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    pdfFile = req.files.pdfFile;
    uploadPath = __basedir + '/uploads/' + pdfFile.name;
  
    pdfFile.mv(uploadPath, function(err) {
      if (err)
      return res.json({ code: httpStatus.OK, message: 'err', file: 'filename' });
  
        return res.json({ code: httpStatus.OK, message: 'Pdf uploaded successfully', file: pdfFile.name });
    });
  } catch (error) {
    return next(error);
  }
};
