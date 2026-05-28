const express = require("express");
const router = express.Router();
const {
  linkedinCallback,
  importLinkedinProfile,
} = require("../controllers/linkedin.controller");

router.get("/callback", linkedinCallback);
router.post("/import", importLinkedinProfile);

module.exports = router;