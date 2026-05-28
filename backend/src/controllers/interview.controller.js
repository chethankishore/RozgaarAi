const interviewService = require("../services/interview.service");

const generateQuestions = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Resume text is required",
      });
    }

    const questions = await interviewService.generateQuestions(
      resumeText,
      jobDescription
    );

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Interview Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const questions = await interviewService.getQuestionsByResumeId(resumeId);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { generateQuestions, getQuestions };