const fs = require("fs");
const path = require("path");
require("dotenv").config();

// For now we store locally
// Later can be swapped with AWS S3

const uploadsDir = path.join(__dirname, "../../uploads");

// Save file locally
const saveFile = async (file) => {
  try {
    const fileUrl = `${process.env.NODE_ENV === "production" 
      ? "https://your-domain.com" 
      : "http://localhost:" + (process.env.PORT || 5000)}/uploads/${file.filename}`;

    return {
      fileName: file.originalname,
      fileUrl,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  } catch (error) {
    console.error("Save File Error:", error);
    throw error;
  }
};

// Delete file locally
const deleteFile = async (fileName) => {
  try {
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true, message: "File deleted successfully" };
    }
    return { success: false, message: "File not found" };
  } catch (error) {
    console.error("Delete File Error:", error);
    throw error;
  }
};

// Get file path
const getFilePath = (fileName) => {
  try {
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    throw new Error("File not found");
  } catch (error) {
    console.error("Get File Path Error:", error);
    throw error;
  }
};

module.exports = { saveFile, deleteFile, getFilePath };