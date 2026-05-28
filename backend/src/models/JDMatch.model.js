const mongoose = require("mongoose");

const JDMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchResult: {
      matchScore: { type: Number },
      summary: { type: String },
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      experienceMatch: {
        score: { type: Number },
        comment: { type: String },
      },
      educationMatch: {
        score: { type: Number },
        comment: { type: String },
      },
      suggestions: [{ type: String }],
    },
    skillGapResult: {
      overallGapScore: { type: Number },
      summary: { type: String },
      technicalSkills: {
        have: [{ type: String }],
        missing: [{ type: String }],
        partial: [{ type: String }],
      },
      softSkills: {
        have: [{ type: String }],
        missing: [{ type: String }],
      },
      heatmap: [
        {
          skill: { type: String },
          level: { type: String },
          required: { type: String },
          gap: { type: String },
        },
      ],
      learningPath: [
        {
          skill: { type: String },
          priority: { type: String },
          resources: [{ type: String }],
        },
      ],
      suggestions: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JDMatch", JDMatchSchema);