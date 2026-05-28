const pdfParse = require("pdf-parse");
const fs = require("fs");

const parseResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    const cleanText = data.text
      .replace(/\s+/g, " ")
      .trim();

    return {
      text: cleanText,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("Parser Service Error:", error);
    throw error;
  }
};

const parseResumeFromBuffer = async (buffer) => {
  try {
    const data = await pdfParse(buffer);

    const cleanText = data.text
      .replace(/\s+/g, " ")
      .trim();

    return {
      text: cleanText,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("Parser Buffer Service Error:", error);
    throw error;
  }
};

module.exports = { parseResume, parseResumeFromBuffer };