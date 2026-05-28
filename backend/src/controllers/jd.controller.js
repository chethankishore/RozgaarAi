const jdMatchService = require("../services/jdMatch.service");
const skillGapService = require("../services/skillGap.service");

const matchJD = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume text and job description are required",
      });
    }

    const matchResult = await jdMatchService.matchJD(
      resumeText,
      jobDescription
    );

    res.status(200).json({
      success: true,
      data: matchResult,
    });
  } catch (error) {
    console.error("JD Match Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getSkillGap = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume text and job description are required",
      });
    }

    const skillGapResult = await skillGapService.getSkillGap(
      resumeText,
      jobDescription
    );

    res.status(200).json({
      success: true,
      data: skillGapResult,
    });
  } catch (error) {
    console.error("Skill Gap Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { matchJD, getSkillGap };