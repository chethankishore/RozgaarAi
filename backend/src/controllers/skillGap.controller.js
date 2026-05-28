const { getSkillGap } = require("../services/skillGap.service");
const Resume = require("../models/Resume.model");

/**
 * Analyze skill gap between a resume (by ID or direct text) and a job description
 * POST /api/skill-gap/analyze
 * 
 * Request body (option A - with resumeId):
 *   { "resumeId": "67...", "jobDescription": "..." }
 * 
 * Request body (option B - with direct text):
 *   { "resumeText": "...", "jobDescription": "..." }
 */
const analyzeSkillGap = async (req, res) => {
  try {
    let resumeText = req.body.resumeText;
    const { jobDescription, resumeId } = req.body;

    // Validation
    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    // If resumeId is provided, fetch from DB
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found or access denied",
        });
      }
      resumeText = resume.parsedText;
    }

    // If still no resumeText, fail
    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required (either via resumeId or resumeText field)",
      });
    }

    // Call the AI service
    const result = await getSkillGap(resumeText, jobDescription);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Skill Gap Controller Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to analyze skill gap",
      error: error.message,
    });
  }
};

module.exports = { analyzeSkillGap };