const { getAIResponse } = require("./ai.service");

const generateQuestions = async (resumeText, jobDescription) => {
  try {
    const prompt = `
      Generate interview questions based on this resume and job description.
      Return a JSON object with this exact structure:
      {
        "totalQuestions": <number>,
        "categories": {
          "technical": [
            {
              "question": "<question>",
              "difficulty": "<easy | medium | hard>",
              "topic": "<topic name>",
              "hint": "<hint for answer>"
            }
          ],
          "behavioral": [
            {
              "question": "<question>",
              "difficulty": "<easy | medium | hard>",
              "topic": "<topic name>",
              "hint": "<hint for answer>"
            }
          ],
          "situational": [
            {
              "question": "<question>",
              "difficulty": "<easy | medium | hard>",
              "topic": "<topic name>",
              "hint": "<hint for answer>"
            }
          ],
          "roleSpecific": [
            {
              "question": "<question>",
              "difficulty": "<easy | medium | hard>",
              "topic": "<topic name>",
              "hint": "<hint for answer>"
            }
          ]
        },
        "tips": ["<tip1>", "<tip2>", "<tip3>"]
      }

      Resume Text:
      ${resumeText}

      Job Description:
      ${jobDescription || "Not provided, generate general questions based on resume"}
    `;

    const result = await getAIResponse(prompt);
    return result;
  } catch (error) {
    console.error("Interview Service Error:", error);
    throw error;
  }
};

const getQuestionsByResumeId = async (resumeId) => {
  try {
    // This will be connected to MongoDB later
    // For now return empty
    return {
      resumeId,
      questions: [],
      message: "No questions found for this resume yet"
    };
  } catch (error) {
    console.error("Get Questions Error:", error);
    throw error;
  }
};

module.exports = { generateQuestions, getQuestionsByResumeId };