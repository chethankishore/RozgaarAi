const linkedinService = require("../services/linkedin.service");

const linkedinCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    const profile = await linkedinService.handleCallback(code);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("LinkedIn Callback Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const importLinkedinProfile = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    const resumeData = await linkedinService.importProfile(accessToken);

    res.status(200).json({
      success: true,
      data: resumeData,
    });
  } catch (error) {
    console.error("LinkedIn Import Error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { linkedinCallback, importLinkedinProfile };