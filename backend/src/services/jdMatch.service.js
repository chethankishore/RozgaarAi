const { getAIResponse } = require("./ai.service");

const matchJD = async (resumeText, jobDescription) => {
  try {
    const prompt = `
      Compare this resume against the job description and analyze the match.
      Return a JSON object with this exact structure:
      {
        "matchScore": <number between 0-100>,
        "summary": "<brief summary of the match>",
        "matchedSkills": ["<skill1>", "<skill2>", "<skill3>"],
        "missingSkills": ["<skill1>", "<skill2>", "<skill3>"],
        "experienceMatch": {
          "score": <number between 0-100>,
          "comment": "<comment about experience match>"
        },
        "educationMatch": {
          "score": <number between 0-100>,
          "comment": "<comment about education match>"
        },
        "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
      }

      Resume Text:
      ${resumeText}

      Job Description:
      ${jobDescription}
    `;

    const result = await getAIResponse(prompt);
    return result;
  } catch (error) {
    console.error("JD Match Service Error:", error);
    throw error;
  }
};

module.exports = { matchJD };