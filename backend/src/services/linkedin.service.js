const axios = require("axios");
require("dotenv").config();

const handleCallback = async (code) => {
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get profile using access token
    const profile = await importProfile(accessToken);

    return {
      accessToken,
      profile,
    };
  } catch (error) {
    console.error("LinkedIn Callback Error:", error);
    throw error;
  }
};

const importProfile = async (accessToken) => {
  try {
    // Get basic profile
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          projection:
            "(id,firstName,lastName,headline,summary,positions,educations,skills)",
        },
      }
    );

    // Get email
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profile = profileResponse.data;
    const email =
      emailResponse.data.elements[0]["handle~"].emailAddress;

    // Format into resume structure
    const resumeData = {
      name: `${profile.firstName.localized.en_US} ${profile.lastName.localized.en_US}`,
      email,
      headline: profile.headline || "",
      summary: profile.summary || "",
      experience: profile.positions?.values?.map((pos) => ({
        title: pos.title,
        company: pos.company.name,
        startDate: pos.startDate,
        endDate: pos.endDate || "Present",
        description: pos.summary || "",
      })) || [],
      education: profile.educations?.values?.map((edu) => ({
        school: edu.schoolName,
        degree: edu.degree || "",
        field: edu.fieldOfStudy || "",
        startDate: edu.startDate,
        endDate: edu.endDate || "Present",
      })) || [],
      skills: profile.skills?.values?.map((s) => s.skill.name) || [],
    };

    return resumeData;
  } catch (error) {
    console.error("LinkedIn Import Error:", error);
    throw error;
  }
};

module.exports = { handleCallback, importProfile };