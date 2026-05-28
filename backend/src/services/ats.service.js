const { getAIResponse } = require("./ai.service");

const analyzeATS = async (resumeText) => {
  try {
    const prompt = `
      Analyze this resume for ATS (Applicant Tracking System) compatibility.
      Return a JSON object with this exact structure:
      {
        "atsScore": <number between 0-100>,
        "summary": "<brief summary of ATS compatibility>",
        "strengths": ["<strength1>", "<strength2>", "<strength3>"],
        "weaknesses": ["<weakness1>", "<weakness2>", "<weakness3>"],
        "keywords": {
          "found": ["<keyword1>", "<keyword2>"],
          "missing": ["<keyword1>", "<keyword2>"]
        },
        "formatting": {
          "score": <number between 0-100>,
          "issues": ["<issue1>", "<issue2>"]
        },
        "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
      }

      Resume Text:
      ${resumeText}
    `;

    const result = await getAIResponse(prompt);
    return result;
  } catch (error) {
    console.error("ATS Service Error:", error);
    throw error;
  }
};

module.exports = { analyzeATS };