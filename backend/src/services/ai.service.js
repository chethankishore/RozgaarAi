const Groq = require("groq-sdk");                          // Fix 1: import → require

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // Fix 2: groq was never initialized

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAIResponse = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],     // Fix 3: question → prompt
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
      });

      const text = result.choices[0]?.message?.content || ""; // Fix 4: result.response.text() → result.choices[0]
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch (error) {
      const is429 = error.message?.includes("429");
      if (is429 && i < retries - 1) {
        const waitTime = (i + 1) * 20000;
        console.log(`⏳ Rate limited. Waiting ${waitTime / 1000}s before retry ${i + 1}...`);
        await sleep(waitTime);
        continue;
      }
      if (error instanceof SyntaxError) {
        throw new Error("AI returned invalid JSON. Please try again.");
      }
      console.error("AI Service Error:", error.message);
      throw error;
    }
  }
};

module.exports = { getAIResponse };