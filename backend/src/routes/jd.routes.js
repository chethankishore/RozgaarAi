const express = require("express");
const router = express.Router();
const {
  matchJD,
  getSkillGap,
} = require("../controllers/jd.controller");

router.post("/match", matchJD);
router.post("/skillgap", getSkillGap);

module.exports = router;