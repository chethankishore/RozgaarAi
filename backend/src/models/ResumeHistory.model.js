const mongoose = require("mongoose");

const resumeHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  action: { type: String, enum: ["uploaded", "analyzed", "deleted"], default: "analyzed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ResumeHistory", resumeHistorySchema);
// const mongoose = require("mongoose");

// const ResumeHistorySchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     resumeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Resume",
//       required: true,
//     },
//     action: {
//       type: String,
//       enum: [
//         "uploaded",
//         "parsed",
//         "ats_analyzed",
//         "jd_matched",
//         "interview_generated",
//         "linkedin_imported",
//       ],
//       required: true,
//     },
//     result: {
//       type: Object,
//       default: {},
//     },
//     score: {
//       type: Number,
//       default: 0,
//     },
//     jobDescription: {
//       type: String,
//       default: "",
//     },
//     notes: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("ResumeHistory", ResumeHistorySchema);