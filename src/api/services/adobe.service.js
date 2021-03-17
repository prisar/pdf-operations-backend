const PDFToolsSdk = require("@adobe/documentservices-pdftools-node-sdk");

exports.merge = async (firstPdf, secondPdf) => {
  try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder().fromFile("pdftools-api-credentials.json").build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
      combineFilesOperation = PDFToolsSdk.CombineFiles.Operation.createNew();

    // Set operation input from a source file.
    const combineSource1 = PDFToolsSdk.FileRef.createFromLocalFile(`${__basedir}/files/${firstPdf}`),
      combineSource2 = PDFToolsSdk.FileRef.createFromLocalFile(`${__basedir}/files/${secondPdf}`);
    combineFilesOperation.addInput(combineSource1);
    combineFilesOperation.addInput(combineSource2);

    const outputFile = `${firstPdf.replace('.pdf', '')}_${secondPdf.replace('.pdf', '')}_merged.pdf`;

    // Execute the operation and Save the result to the specified location.
    combineFilesOperation
      .execute(executionContext)
      .then((result) => result.saveAsFile(`${__basedir}/files/${outputFile}`))
      .catch((err) => {
        if (err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });
   return outputFile;
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
};
