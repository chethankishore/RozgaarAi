const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String },
  difficulty: { type: String, enum: ["easy", "medium", "hard"] },
  topic: { type: String },
  hint: { type: String },
});

const InterviewSessionSchema = new mongoose.Schema(
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
    },
    questions: {
      technical: [QuestionSchema],
      behavioral: [QuestionSchema],
      situational: [QuestionSchema],
      roleSpecific: [QuestionSchema],
    },
    tips: [{ type: String }],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewSession",
  InterviewSessionSchema
);