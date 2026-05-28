const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileSize: Number,
    mimeType: String,

    parsedText: {
      type: String,
      default: "",
    },

    parsedData: {
      name: String,
      email: String,
      phone: String,
      location: String,
      summary: String,
      skills: { type: [String], default: [] },

      experience: [
        {
          title: String,
          company: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],

      education: [
        {
          school: String,
          degree: String,
          field: String,
          startDate: String,
          endDate: String,
        },
      ],
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    atsResult: {
      scoreBreakdown: {},
      keywordsMatched: [String],
      missingKeywords: [String],
    },

    suggestions: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["uploaded", "parsed", "analyzed"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

// 🔥 Important for performance
ResumeSchema.index({ user: 1 });

module.exports = mongoose.model("Resume", ResumeSchema);