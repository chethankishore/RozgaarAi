const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload.middleware");
const { protect } = require("../middleware/auth.middleware");
const { 
  uploadResume, 
  analyzeResume, 
  applyResumeSuggestions,
  getResumeById          // <-- import the new function
} = require("../controllers/resume.controller");

router.get("/test", (req, res) => res.send("Resume route working ✅"));
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.post("/apply-suggestions", protect, applyResumeSuggestions);
router.get("/:id", protect, getResumeById);   // <-- this line is critical

module.exports = router;
// // // // const express = require("express");

// // // // const router = express.Router();
// // // // const { upload } = require("../middleware/upload.middleware");
// // // // const { protect } = require("../middleware/auth.middleware");
// // // // const { uploadResume, analyzeResume } = require("../controllers/resume.controller");
// // // // const { uploadResume, analyzeResume, applyResumeSuggestions } = require("../controllers/resume.controller");

// // // // // ... existing routes ...

// // // // router.post("/apply-suggestions", protect, applyResumeSuggestions);

// // // // router.get("/test", (req, res) => res.send("Resume route working ✅"));
// // // // router.post("/upload", protect, upload.single("resume"), uploadResume);
// // // // router.post("/analyze", protect, upload.single("resume"), analyzeResume);

// // // // module.exports = router;
// // // // backend/src/routes/resume.routes.js
// // // const express = require("express");
// // // const router = express.Router();
// // // const { upload } = require("../middleware/upload.middleware");
// // // const { protect } = require("../middleware/auth.middleware");
// // // const { 
// // //   uploadResume, 
// // //   analyzeResume, 
// // //   applyResumeSuggestions 
// // // } = require("../controllers/resume.controller");

// // // // Test route
// // // router.get("/test", (req, res) => res.send("Resume route working ✅"));

// // // // Actual routes
// // // router.post("/upload", protect, upload.single("resume"), uploadResume);
// // // router.post("/analyze", protect, upload.single("resume"), analyzeResume);
// // // router.post("/apply-suggestions", protect, applyResumeSuggestions);

// // // module.exports = router;
// // // backend/src/routes/resume.routes.js
// // const express = require("express");
// // const router = express.Router();
// // const { upload } = require("../middleware/upload.middleware");
// // const { protect } = require("../middleware/auth.middleware");
// // const { 
// //   uploadResume, 
// //   analyzeResume,
// //   // applyResumeSuggestions   // <-- comment out until function exists
// // } = require("../controllers/resume.controller");

// // router.get("/test", (req, res) => res.send("Resume route working ✅"));
// // router.post("/upload", protect, upload.single("resume"), uploadResume);
// // router.post("/analyze", protect, upload.single("resume"), analyzeResume);
// // // router.post("/apply-suggestions", protect, applyResumeSuggestions); // <-- comment out

// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { upload } = require("../middleware/upload.middleware");
// const { protect } = require("../middleware/auth.middleware");
// const { 
//   uploadResume, 
//   analyzeResume,
//   applyResumeSuggestions,
//   getResumeById   // ✅ uncommented
// } = require("../controllers/resume.controller");

// router.get("/test", (req, res) => res.send("Resume route working ✅"));

// router.post("/upload", protect, upload.single("resume"), uploadResume);
// router.post("/analyze", protect, upload.single("resume"), analyzeResume);
// router.get('/:id', protect, getResumeById);
// router.post("/apply-suggestions", protect, applyResumeSuggestions); // ✅ uncommented

// module.exports = router;