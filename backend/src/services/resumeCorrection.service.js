// const { getAIResponse } = require("./ai.service");

// /**
//  * Apply one or more suggestions to a resume text using AI.
//  * @param {string} resumeText - Original parsed resume text
//  * @param {string[]} suggestions - Array of suggestion strings
//  * @returns {Promise<string>} - Corrected resume text
//  */
// const applySuggestions = async (resumeText, suggestions) => {
//   const prompt = `
// You are a professional resume editor. Apply the following suggestions to the resume text below.

// Suggestions:
// ${suggestions.map((s, i) => `${i+1}. ${s}`).join('\n')}

// Rules:
// - Only improve the resume based on the suggestions.
// - Keep the same overall structure and tone.
// - Do NOT add any extra text, commentary, or markdown formatting.
// - Return ONLY the corrected resume as plain text.

// Original Resume:
// ${resumeText}

// Corrected Resume:
// `;

//   const response = await getAIResponse(prompt);
//   // The AI might return plain text or sometimes wrap in quotes – clean it
//   let corrected = response;
//   if (typeof response === 'string') {
//     corrected = response.replace(/^["']|["']$/g, ''); // remove surrounding quotes
//   }
//   return corrected;
// };

// module.exports = { applySuggestions };

// const { getAIResponse } = require("./ai.service");

// const applySuggestions = async (resumeText, suggestions) => {
//   const prompt = `
// You are an expert resume writer.
// Apply the following suggestions to improve this resume.
// Return ONLY the improved resume text, no explanations.

// Suggestions:
// ${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

// Original Resume:
// ${resumeText}
//   `;
//   return await getAIResponse(prompt);
// };

// module.exports = { applySuggestions };
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const applySuggestions = async (resumeText, suggestions) => {
  const prompt = `
You are an expert resume writer.
Apply the following suggestions to improve this resume.
Return ONLY the improved resume text, no explanations, no JSON, no markdown.

Suggestions:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Original Resume:
${resumeText}
  `;

  const result = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
  });

  const correctedText = result.choices[0]?.message?.content?.trim();
  if (!correctedText) throw new Error("AI returned empty response");

  return correctedText;
};

module.exports = { applySuggestions };