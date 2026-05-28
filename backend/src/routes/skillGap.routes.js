// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth.middleware");
// const { analyzeSkillGap } = require("../controllers/skillGap.controller");

// router.post("/analyze", protect, analyzeSkillGap);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");

// Placeholder – implement later
router.post("/analyze", protect, (req, res) => {
  res.status(501).json({ success: false, message: "Skill gap analysis not yet implemented" });
});

module.exports = router;