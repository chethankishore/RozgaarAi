const ResumeHistory = require("../models/ResumeHistory.model");

const getHistory = async (req, res) => {
  try {
    const history = await ResumeHistory.find({ userId: req.user.id })
      .populate("resumeId", "fileName fileUrl atsScore createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHistoryById = async (req, res) => {
  try {
    const history = await ResumeHistory.findOne({ _id: req.params.id, userId: req.user.id }).populate("resumeId", "fileName fileUrl atsScore");
    if (!history) return res.status(404).json({ success: false, message: "History not found" });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error("Get History By Id Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const history = await ResumeHistory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!history) return res.status(404).json({ success: false, message: "History not found" });
    res.status(200).json({ success: true, message: "History deleted successfully" });
  } catch (error) {
    console.error("Delete History Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHistory, getHistoryById, deleteHistory };
// const ResumeHistory = require("../models/ResumeHistory.model");

// const getHistory = async (req, res) => {
//   try {
//     const history = await ResumeHistory.find({ userId: req.user.id })
//       .populate("resumeId", "fileName fileUrl atsScore")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: history,
//     });
//   } catch (error) {
//     console.error("Get History Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const getHistoryById = async (req, res) => {
//   try {
//     const history = await ResumeHistory.findOne({
//       _id: req.params.id,
//       userId: req.user.id,
//     }).populate("resumeId", "fileName fileUrl atsScore");

//     if (!history) {
//       return res.status(404).json({
//         success: false,
//         message: "History not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: history,
//     });
//   } catch (error) {
//     console.error("Get History By Id Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// const deleteHistory = async (req, res) => {
//   try {
//     const history = await ResumeHistory.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id,
//     });

//     if (!history) {
//       return res.status(404).json({
//         success: false,
//         message: "History not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "History deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete History Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = { getHistory, getHistoryById, deleteHistory };