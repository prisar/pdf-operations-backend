const orderBy = require("lodash/orderBy");
const fs = require("fs");

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

    const outputFile = `${firstPdf.replace(".pdf", "")}_${secondPdf.replace(".pdf", "")}_merged.pdf`;
    const outpath = `${__basedir}/files/${outputFile}`;
    if (fs.existsSync(outpath)) {
      fs.unlinkSync(outpath);
    }

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

exports.split = async (pdfFile, pages, pageRangesInput) => {
  try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder().fromFile("pdftools-api-credentials.json").build();

    // Create an ExecutionContext using credentials
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials);

    // Create a new operation instance.
    const splitPDFOperation = PDFToolsSdk.SplitPDF.Operation.createNew(),
      input = PDFToolsSdk.FileRef.createFromLocalFile(`${__basedir}/files/${pdfFile}`, PDFToolsSdk.SplitPDF.SupportedSourceFormat.pdf);
    // Set operation input from a source file.
    splitPDFOperation.setInput(input);

    // Set the page ranges where each page range corresponds to a single output file.
    // Specify pages ranges.
    const pageRanges = new PDFToolsSdk.PageRanges();
    // Add page
    pages.map((page) => pageRanges.addSinglePage(page));

    // Add pages ranges
    pageRangesInput.forEach((e) => pageRanges.addPageRange(e.range.start, e.range.end));
    splitPDFOperation.setPageRanges(pageRanges);

    // Execute the operation and Save the result to the specified location.
    splitPDFOperation
      .execute(executionContext)
      .then((result) => {
        let saveFilesPromises = [];

        for (let i = 0; i < result.length; i++) {
          const outpath = `${__basedir}/files/SplitPDFByPageRangesOutput_${i}.pdf`;
          if (fs.existsSync(outpath)) {
            fs.unlinkSync(outpath);
          }
          saveFilesPromises.push(result[i].saveAsFile(`${__basedir}/files/SplitPDFByPageRangesOutput_${i}.pdf`));
        }
        return Promise.all(saveFilesPromises);
      })
      .catch((err) => {
        if (err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
};

exports.delete = async (pdfFile, pages, pageRangesInput) => {
  try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder().fromFile("pdftools-api-credentials.json").build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
      deletePagesOperation = PDFToolsSdk.DeletePages.Operation.createNew();

    // Set operation input from a source file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile(`${__basedir}/files/${pdfFile}`);
    deletePagesOperation.setInput(input);

    // Delete pages of the document (as specified by PageRanges).
    // then,
    // Specify pages for deletion.
    const pageRangesForDeletion = new PDFToolsSdk.PageRanges();
    // Add pages
    pages.map((page) => pageRangesForDeletion.addSinglePage(parseInt(page)));

    // Add page ranges
    pageRangesInput.map((e) => pageRangesForDeletion.addPageRange(parseInt(e.range.start), parseInt(e.range.end)));
    deletePagesOperation.setPageRanges(pageRangesForDeletion);

    const outpath = `${__basedir}/files/deletePagesOutput.pdf`;
    if (fs.existsSync(outpath)) {
      fs.unlinkSync(outpath);
    }

    // Execute the operation and Save the result to the specified location.
    deletePagesOperation
      .execute(executionContext)
      .then(async (result) => await result.saveAsFile(`${__basedir}/files/deletePagesOutput.pdf`))
      .catch((err) => {
        if (err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });
    return "deletePagesOutput.pdf";
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
};

exports.reorder = async (pdfFile, pageIndexes) => {
  try {
    // Initial setup, create credentials instance.
    const credentials = PDFToolsSdk.Credentials.serviceAccountCredentialsBuilder().fromFile("pdftools-api-credentials.json").build();

    // Create an ExecutionContext using credentials and create a new operation instance.
    const executionContext = PDFToolsSdk.ExecutionContext.create(credentials),
      reorderPagesOperation = PDFToolsSdk.ReorderPages.Operation.createNew();

    // Set operation input from a source file, along with specifying the order of the pages for
    // rearranging the pages in a PDF file.
    const input = PDFToolsSdk.FileRef.createFromLocalFile(`${__basedir}/files/${pdfFile}`);

    // Specify order of the pages for an output document.
    const pageRanges = new PDFToolsSdk.PageRanges();

    const orderedIndexes = orderBy(pageIndexes, ["index"], ["asc"]);

    orderedIndexes.map((orderedIndex) => {
      const indexType = orderedIndex.type;
      // single page
      if (indexType === "page") {
        const pageNo = orderedIndex.page;
        // Add page
        pageRanges.addSinglePage(pageNo);
        return;
      }
      // range of pages
      if (indexType === "range") {
        const { range } = { ...orderedIndex };
        // Add pages start to end.
        pageRanges.addPageRange(range.start, range.end);
        return;
      }
    });

    reorderPagesOperation.setInput(input);
    reorderPagesOperation.setPagesOrder(pageRanges);

    const outpath = `${__basedir}/files/reorderPagesOutput.pdf`;
    if (fs.existsSync(outpath)) {
      fs.unlinkSync(outpath);
    }

    // Execute the operation and Save the result to the specified location.
    reorderPagesOperation
      .execute(executionContext)
      .then((result) => result.saveAsFile(`${__basedir}/files/reorderPagesOutput.pdf`))
      .catch((err) => {
        if (err instanceof PDFToolsSdk.Error.ServiceApiError || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
          console.log("Exception encountered while executing operation", err);
        } else {
          console.log("Exception encountered while executing operation", err);
        }
      });
  } catch (err) {
    console.log("Exception encountered while executing operation", err);
  }
};
