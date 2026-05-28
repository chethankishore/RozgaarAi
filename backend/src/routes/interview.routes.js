const express = require("express");
const router = express.Router();
const {
  generateQuestions,
  getQuestions,
} = require("../controllers/interview.controller");

router.post("/generate", generateQuestions);
router.get("/:resumeId", getQuestions);

module.exports = router;